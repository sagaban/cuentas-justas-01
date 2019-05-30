<template>
  <q-page class="column page-home">
    <h1 class="text-h1">
      Cuentas Justas
    </h1>
    <div class="text-subtitle1">Conservan la amistad</div>

    <q-btn fab icon="add" color="primary" size="lg" class="fixed add-event-button" to="/newEvent" />
  </q-page>
</template>

<style scoped>
.page-home {
  padding: 1rem;
  justify-content: flex-start;
}

/* TODO: improve the image size*/
.page-home::after {
  background-image: url(../assets/images/piggy-bank.jpg);
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  content: '';
  opacity: 0.5;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}

.text-subtitle1 {
  font-size: 3rem;
  line-height: 3rem;
}

.add-event-button {
  right: 2rem;
  bottom: 2rem;
  padding-top: 1rem;
}
</style>

<script>
export default {
  name: 'PageHome',
};
</script>
