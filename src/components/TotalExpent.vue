<template>
  <div class="total-expent-container">
    <q-table title="Total gastado" :data="data" :columns="columns" row-key="name" hide-bottom />
  </div>
</template>

<script>
import set from 'lodash-es/set';

export default {
  name: 'totalExpent',
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
            format: val => `${val}`,
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

      /*{
  "Santiago": {
    "ARS": 1200,
    "USD": 150,
    "CLP": 0
  },
  "Exe": {
    "ARS": 1200,
    "USD": 150,
    "CLP": 0
  },
  "Diego": {
    "ARS": 1200,
    "USD": 150,
    "CLP": 0
  }
}*/
      return transactions.reduce((acc, { payer, currency, amount }) => {
        const accCopy = Object.assign({}, acc);
        const previousValue = accCopy[payer][currency];
        set(accCopy, [payer, currency], previousValue + +amount);
        return accCopy;
      }, baseDataStructure);
    },
    data() {
      const balances = this.participanBalances;
      /**{
          name: 'Santiago',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        }, */
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
