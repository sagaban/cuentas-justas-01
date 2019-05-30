<template>
  <q-page>
    <h4 class="text-center title">Event id: {{ eventId }}</h4>
  </q-page>
</template>

<script>
export default {
  computed: {
    eventId() {
      return this.$route.params.id;
    },
  },
};
</script>

<style></style>
