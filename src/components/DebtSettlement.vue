<template>
  <div class="debt-settlement-container">
    <q-table
      title="Ajuste de cuentas"
      :data="debtSettlementTableData"
      :columns="columns"
      row-key="name"
      hide-bottom
    />
  </div>
</template>

<script>
import set from 'lodash-es/set';
import get from 'lodash-es/get';
import { round } from '@/utils/format';

export default {
  name: 'debtSettlement',
  computed: {
    columns() {
      const currenciesColumn = this.$store.getters.allCurrencies.reduce(
        (acc, currency) =>
          acc.concat({
            name: currency.value,
            required: true,
            label: currency.value,
            align: 'center',
            field: row => row[currency.value],
            format: val => `${round(val, 2)}`,
            sortable: true,
          }),
        []
      );
      return [
        {
          name: 'debtor',
          required: true,
          label: 'Deudor',
          align: 'left',
          field: row => row.debtor,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'creditor',
          required: true,
          label: 'Acreedor',
          align: 'left',
          field: row => row.creditor,
          format: val => `${val}`,
          sortable: true,
        },
        ...currenciesColumn,
      ];
    },
    /* Output structure
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
    }*/
    participanDebts() {
      /**
      Transaction data structure
      {
        "amount": "150",
        "concept": "Alojamiento",
        "currency": "USD",
        "date": "31-05-2019",
        "payer": "Santiago",
        "splitBeetwen": ["Exe", "Diego"]
      }
      */
      const transactions = this.$store.state.transactions;
      return transactions.reduce((acc, { payer, amount, splitBeetwen, currency }) => {
        const accCopy = Object.assign({}, acc);
        const splitedAmount = +amount / (splitBeetwen.length + 1);
        splitBeetwen.forEach(participant => {
          // Check if the payer participan has a dept with splitBeetwen participant
          const previousDebt = get(accCopy, [payer, participant, currency], 0);
          const debtDifference = previousDebt - splitedAmount * 2;
          if (debtDifference > 0) {
            set(accCopy, [payer, participant, currency], debtDifference);
          } else {
            // If not, just add the debt
            const previousOwe = get(accCopy, [participant, payer, currency], 0);
            set(accCopy, [participant, payer, currency], previousOwe + splitedAmount);
          }
        });
        return accCopy;
      }, {});
    },

    /**
  {
  "Exe": {
    "Santiago": {
      "USD": 43.333333333333336
    },
    "Diego": {
      "ARS": 400
    }
  },
  "Diego": {
    "Santiago": {
      "USD": 50
    },
    "Exe": {
      "USD": 3.3333333333333335
    }
  },
  "Santiago": {
    "Diego": {
      "ARS": 400
    }
  }
}
     */

    debtSettlementTableData() {
      const debts = this.participanDebts;

      return Object.keys(debts).reduce((debtorAcc, debtor) => {
        const debtorDebts = debts[debtor];
        return debtorAcc.concat(
          ...Object.keys(debtorDebts).reduce((creditorAcc, creditor) => {
            return creditorAcc.concat({
              ...debtorDebts[creditor],
              creditor,
              debtor,
            })
          }, [])
        );
      }, []);
    },
  },
};
</script>

<style></style>
