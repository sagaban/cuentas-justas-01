<template>
  <q-page>
    <q-tabs v-model="tab" dense inline-label align="justify">
      <q-tab class="text-secondary" name="generalView" icon="mail" label="Vista General" />
      <q-tab class="text-accent" name="transactions" icon="movie" label="Transacciones" />
    </q-tabs>

    <q-btn
      fab
      icon="add"
      color="accent"
      size="lg"
      class="fixed add-transaction-button"
      @click="newTransactionHandler"
    />
  </q-page>
</template>

<script>
export default {
  name: 'PageEvent',
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
</style>
