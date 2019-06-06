<template>
  <q-page class="event-page">
    <!-- TODO: Move this conditional to a more general place -->
    <div v-if="$store.state.eventId">
      <q-tabs dense :value="tab" inline-label align="justify" @input="onTabChange">
        <q-tab class="text-secondary" name="generalView" icon="mail" label="Vista General" />
        <q-tab class="text-accent" name="transactions" icon="movie" label="Transacciones" />
      </q-tabs>
      <div v-if="tab === 'generalView'">
        <div class="component-wrapper">
          <Currency-exchange v-if="isMultipleCurrency" />
        </div>
        <div class="component-wrapper">
          <total-expent />
        </div>
        <div class="component-wrapper">
          <individual-balance />
        </div>
        <div class="component-wrapper">
          <debt-settlement />
        </div>
      </div>
      <div v-else>
        <transaction-list />
      </div>

      <q-btn
        fab
        icon="add"
        color="accent"
        size="lg"
        class="fixed add-transaction-button"
        @click="newTransactionHandler"
      />
    </div>
  </q-page>
</template>

<script>
import TotalExpent from '@/components/TotalExpent';
import IndividualBalance from '@/components/IndividualBalance';
import DebtSettlement from '@/components/DebtSettlement';
import CurrencyExchange from '@/components/CurrencyExchange';
import TransactionList from '@/components/TransactionList';

export default {
  name: 'PageEvent',
  components: {
    TotalExpent,
    IndividualBalance,
    DebtSettlement,
    CurrencyExchange,
    TransactionList,
  },
  beforeCreate() {
    if (this.$store.state.eventId !== this.$route.params.eventId) {
      //TODO: redirect if not exists
      //TODO: Select an active user
      this.$store.dispatch('LOAD_EVENT', this.$route.params.eventId).catch(e => {
        this.$q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: e,
        });
      });
    }
  },
  computed: {
    tab() {
      return this.$route.name === 'transactionList' ? 'transactions' : 'generalView';
    },
    eventId() {
      return this.$route.params.eventId;
    },
    isMultipleCurrency() {
      return this.$store.state.otherCurrencies.length > 0;
    },
  },
  methods: {
    onTabChange(value) {
      switch (value) {
        case 'generalView':
          this.$router.replace({ name: 'event', params: { id: this.eventId } });
          break;
        case 'transactions':
          this.$router.replace({
            name: 'transactionList',
            params: { id: this.eventId },
          });
          break;

        default:
          break;
      }
      console.log({ value });
    },
    newTransactionHandler() {
      this.$router.push({ name: 'newTransaction', params: { id: this.eventId } });
    },
  },
};
</script>

<style scoped>
.event-page {
  padding-bottom: 7rem;
}
.add-transaction-button {
  right: 2rem;
  bottom: 2rem;
  padding-top: 1rem;
}
.component-wrapper {
  margin: 0.5rem;
}
</style>
