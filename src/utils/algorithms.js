import Vue from 'vue';

import set from 'lodash-es/set';
import get from 'lodash-es/get';

/*{
  "Santiago": {
    "ARS": 400,
    "USD": 150,
    "CLP": 0
  },
  "Exe": {
    "ARS": 0,
    "USD": 0,
    "CLP": 20000
  },
  "Diego": {
    "ARS": 2200,
    "USD": 0,
    "CLP": 1500
  }
}*/

export const participantTotalExpenses = (participants, transactions, allCurrencies) => {
  Vue.$log.debug('participantTotalExpenses');

  const baseSpent = allCurrencies.reduce((acc, currency) => {
    return { ...acc, [currency.value]: 0 };
  }, {});

  const baseDataStructure = participants.reduce((acc, participant) => {
    return { ...acc, [participant]: { ...baseSpent } };
  }, {});
  /**
    Transaction data structure
    {
      "id": "b613ce20-8860-11e9-b215-3dd9e1aad4d4"
      "amount": "150",
      "concept": "Alojamiento",
      "currency": "USD",
      "date": "31-05-2019",
      "payer": "Santiago",
      "splitBetween": ["Exe", "Diego"]
    }
  */
  return transactions.reduce((acc, { payer, currency, amount }) => {
    const accCopy = Object.assign({}, acc);
    const previousValue = accCopy[payer][currency];
    set(accCopy, [payer, currency], previousValue + +amount);
    return accCopy;
  }, baseDataStructure);
};
/* Output structure
    {
      "Santiago": {
        "ARS": -100,
        "USD": 150,
        "CLP": 0
      },
      "Exe":{...}
  }*/
export const participantsIndividualBalance = (participants, transactions, allCurrencies) => {
  const baseSpent = allCurrencies.reduce((acc, currency) => {
    return { ...acc, [currency.value]: 0 };
  }, {});

  const baseDataStructure = participants.reduce((acc, participant) => {
    return { ...acc, [participant]: { ...baseSpent } };
  }, {});

  return transactions.reduce((acc, { payer, currency, amount, splitBetween }) => {
    const accCopy = Object.assign({}, acc);

    const toSplitBetween = [payer, ...splitBetween];
    // TODO: Fix amount type storage
    const splittedAmount = +amount / toSplitBetween.length;
    toSplitBetween.forEach(p => {
      const previousValue = accCopy[p][currency];
      const toAdd = p === payer ? splittedAmount * splitBetween.length : -splittedAmount;
      set(accCopy, [p, currency], previousValue + toAdd);
    });
    return accCopy;
  }, baseDataStructure);
};

/* Output data structure
  {
    "Santiago": {
      "Exe": {
        ARS: 10,
        CLP: 20000
      }
      Diego: {
        ARS: 1500
      }
    },
    "Exe":{...}
  }
*/

let result = [];

//TODO: Improve this UGLY UGLY (working) code
export const participantDebtsSettlement = (participants, transactions, allCurrencies) => {
  const individualBalances = participantsIndividualBalance(
    participants,
    transactions,
    allCurrencies
  );
  // const individualBalances = {
  //   Santiago: {
  //     ARS: 90,
  //     USD: 100,
  //     CLP: 20000,
  //   },
  //   Exe: {
  //     ARS: 150,
  //     USD: -20,
  //     CLP: 5000,
  //   },
  //   Diego: {
  //     ARS: -140,
  //     USD: -80,
  //     CLP: -15000,
  //   },
  //   Pablo: {
  //     ARS: -150,
  //     USD: 0,
  //     CLP: -10000,
  //   },
  //   Juan: {
  //     ARS: 50,
  //     USD: 0,
  //     CLP: 0,
  //   },
  // };
  // Vue.$log.debug(`individualBalances: ${JSON.stringify(individualBalances)}`);
  const toReturn = {};
  allCurrencies.forEach(currency => {
    Vue.$log.debug('For currency: ' + currency.value);

    const balance = Object.keys(individualBalances).reduce(
      (acc, participant) => {
        const amount = get(individualBalances, [participant, currency.value]);
        if (amount > 0) {
          return { ...acc, positive: acc.positive.concat({ participant, amount }) };
        }
        if (amount < 0) {
          return { ...acc, negative: acc.negative.concat({ participant, amount }) };
        }
        return acc;
      },
      { positive: [], negative: [] }
    );

    // Vue.$log.debug(`balance: ${JSON.stringify(balance)}`);
    balance.positive = balance.positive.sort((a, b) => b.amount - a.amount);
    balance.negative = balance.negative.sort((a, b) => b.amount - a.amount);
    // Vue.$log.debug(`balance.positive: ${JSON.stringify(balance.positive)}`);
    // Vue.$log.debug(`balance.negative: ${JSON.stringify(balance.negative)}`);

    while (balance.positive.length) {
      // Try to find subgroups
      Vue.$log.debug('Try to find subgroups');

      balance.positive.forEach(b => {
        Vue.$log.debug('Balance: ', b);
        let settle;
        for (
          let subsetLength = 1;
          subsetLength <= Math.min(balance.negative.length, 4);
          subsetLength++
        ) {
          if (!settle || !settle.length) {
            // Vue.$log.debug('For subsetLength: ' + subsetLength);
            result = [];
            settle = subsetSum(balance.negative, b.amount * -1, subsetLength);
          }
        }

        // A subgroup was found
        if (settle && settle.length) {
          Vue.$log.debug('A subgroup was found');

          settle[0].forEach(s => {
            set(toReturn, [s.participant, b.participant, currency.value], s.amount * -1);
            balance.negative = balance.negative.filter(nb => nb.participant !== s.participant);
            balance.positive = balance.positive.filter(pb => pb.participant !== b.participant);
          });
        }
      });
      if (balance.positive.length > 1) {
        Vue.$log.debug('There are no subgroups, solving just resting debts');
        // TODO: these are float values, compare them with a error tolerance
        let biggestCredit = balance.positive[0].amount;
        while (biggestCredit) {
          const biggestDebt = balance.negative[0];
          const diff = biggestCredit + biggestDebt.amount;
          if (diff < 0) {
            balance.negative[0] = { ...biggestDebt, amount: diff };
            set(
              toReturn,
              [biggestDebt.participant, balance.positive[0].participant, currency.value],
              biggestCredit
            );
            balance.positive.shift();
            biggestCredit = 0;
          } else {
            biggestCredit = diff;
            set(
              toReturn,
              [biggestDebt.participant, biggestCredit.participant, currency.value],
              biggestDebt.amount * -1
            );
            balance.negative.shift();
          }
        }
      }
    }
  });

  return toReturn;
};

const subsetSum = (balance, target, subsetLength, partial = []) => {
  let s;
  let n;
  let remaining;

  s = partial.reduce((a, b) => a + b.amount, 0);

  if (s < target || partial.length > subsetLength) return null;

  // check if the partial sum is equals to target
  if (s === target && partial.length === subsetLength) {
    result.push(partial);
    // Vue.$log.debug(`${partial.map(p => p.amount).join(' + ')} = ${target}`);
  }

  for (let i = 0; i < balance.length; i++) {
    n = balance[i];
    remaining = balance.slice(i + 1);
    subsetSum(remaining, target, subsetLength, partial.concat([n]));
  }

  return result;
};
