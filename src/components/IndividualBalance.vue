<template>
  <div class="individual-balance-container">
    <div class="table-header">
      <h2 class="table-header--title">Balance Individual</h2>
      <q-icon name="monetization_on" class="table-header--icon" color="secondary" />
    </div>
    <q-table :data="individualBalanceTableData" :columns="columns" row-key="name" hide-bottom />
  </div>
</template>

<script>
import { participantsIndividualBalance } from '@/utils/algorithms';

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

    participanBalances() {
      return participantsIndividualBalance(
        this.$store.state.participants,
        this.$store.state.transactions,
        this.$store.getters.allCurrencies
      );
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

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
}
.table-header--title {
  font-size: 1.4rem;
  letter-spacing: 0.005em;
  font-weight: 400;
  display: inline;
  line-height: 2rem;
  margin: 0;
}
.table-header--icon {
  font-size: 2rem;
  cursor: pointer;
}
</style>
