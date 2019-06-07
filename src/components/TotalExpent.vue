<template>
  <div class="total-expent-container">
    <q-table title="Total gastado" :data="data" :columns="columns" row-key="name" hide-bottom />
  </div>
</template>

<script>
import { participantTotalExpenses } from '@/utils/algorithms';
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
    participantExpenses() {
      return participantTotalExpenses(
        this.$store.state.participants,
        this.$store.state.transactions,
        this.$store.getters.allCurrencies
      );
    },
    data() {
      const balances = this.participantExpenses;
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
