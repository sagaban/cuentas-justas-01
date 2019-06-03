<template>
  <q-page>
    <!-- TODO: Move this conditional to a more general place -->
    <div v-if="$store.state.eventId">
      <q-tabs v-model="tab" dense inline-label align="justify">
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
        Transactions
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

export default {
  name: 'PageEvent',
  components: {
    TotalExpent,
    IndividualBalance,
    DebtSettlement,
    CurrencyExchange,
  },
  beforeCreate() {
    if (this.$store.state.eventId !== this.$route.params.id) {
      //TODO: redirect if not exists
      //TODO: Select an active user
      this.$store.dispatch('LOAD_EVENT', this.$route.params.id).catch(e => {
        this.$q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: e,
        });
      });
    }
  },
  data() {
    return {
      tab: 'generalView',
    };
  },
  computed: {
    eventId() {
      return this.$route.params.id;
    },
    isMultipleCurrency() {
      return this.$store.state.otherCurrencies.length > 0;
    },
  },
  methods: {
    newTransactionHandler() {
      this.$router.push(`/event/${this.eventId}/newTransaction`);
    },
  },
};
</script>

<style>
.add-transaction-button {
  right: 2rem;
  bottom: 2rem;
  padding-top: 1rem;
}
.component-wrapper {
  margin: 0.5rem;
}
</style>
