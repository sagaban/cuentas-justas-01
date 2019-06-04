<template>
  <div class="transaction-list">
    <q-list bordered padding>
      <q-item v-for="transaction in transactions" :key="transaction.amount">
        <q-item-section avatar>
          <q-icon color="primary" name="calendar_today" class="transaction-item--icon" />
          <span class="transaction-item--date">
            {{ formatDate(transaction.date) }}
          </span>
        </q-item-section>

        <q-item-section>
          <q-item-label
            ><b>{{ transaction.payer }}</b
            >: {{ transaction.concept }}</q-item-label
          >
          <q-item-label caption
            >{{ transaction.payer }}, {{ transaction.splitBeetwen.join(', ') }}</q-item-label
          >
        </q-item-section>

        <q-item-section side top>
          <q-chip dense class="currecies-exchange--entry">
            <q-avatar>
              <img :src="getCurrencyImage(transaction.currency)" />
            </q-avatar>
            {{ transaction.amount }}
          </q-chip>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'transactionList',
  computed: {
    transactions() {
      return this.$store.state.transactions;
    },
  },
  methods: {
    formatDate(stringDate) {
      return dayjs(
        stringDate
          .split('-')
          .reverse()
          .join('-')
      ).format('DD MMM');
    },
    getCurrencyImage(value) {
      return require(`../assets/images/currencies/${value.toLowerCase()}.png`);
    },
  },
};
</script>

<style scoped>
.transaction-item--icon {
  margin-left: 50%;
  transform: translateX(-50%);
}
.transaction-item--date {
  width: 100%;
  text-align: center;
  font-size: 0.7rem;
}
</style>
