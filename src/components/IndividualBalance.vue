<template>
  <div class="total-expent-container">
    <q-table
      title="Balance Individual"
      :data="individualBalanceTableData"
      :columns="columns"
      row-key="name"
      hide-bottom
    />
  </div>
</template>

<script>
import set from 'lodash-es/set';
import { round } from '@/utils/format';

export default {
  name: 'individualBalance',
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
          name: 'name',
          required: true,
          label: 'Participante',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
        },
        ...currenciesColumn,
      ];
    },
    /* Output structure
    {
      "Santiago": {
        "ARS": -100,
        "USD": 150,
        "CLP": 0
      },
      "Exe":{...}
    }*/
    participanBalances() {
      const participants = this.$store.state.participants;
      const transactions = this.$store.state.transactions;
      const allCurrencies = this.$store.getters.allCurrencies;

      const baseSpent = allCurrencies.reduce((acc, currency) => {
        return { ...acc, [currency.value]: 0 };
      }, {});

      const baseDataStructure = participants.reduce((acc, participant) => {
        return { ...acc, [participant]: { ...baseSpent } };
      }, {});

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
      return transactions.reduce((acc, { payer, currency, amount, splitBeetwen }) => {
        const accCopy = Object.assign({}, acc);

        const toSplitBeetwen = [payer, ...splitBeetwen];
        // TODO: Fix amount type storage
        const splitedAmount = +amount / toSplitBeetwen.length;
        toSplitBeetwen.forEach(p => {
          const previousValue = accCopy[p][currency];
          const toAdd = p === payer ? splitedAmount * splitBeetwen.length : -splitedAmount;
          set(accCopy, [p, currency], previousValue + toAdd);
        });
        return accCopy;
      }, baseDataStructure);
    },

    individualBalanceTableData() {
      const balances = this.participanBalances;

      return Object.keys(balances).reduce((acc, key) => {
        return acc.concat({
          ...balances[key],
          name: key,
        });
      }, []);
    },
  },
};
</script>

<style></style>
