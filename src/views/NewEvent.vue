<template>
  <q-page>
    <h4 class="text-center title">Nuevo evento</h4>
    <q-separator />

    <q-form ref="newEvent" @submit="onSubmit" @reset="onReset">
      <q-input v-model="eventName" label="Nombre del nuevo evento" lazy-rules :rules="[notEmpty]" />

      <q-select
        v-model="mainCurrency"
        :options="currencyOptions"
        label="Moneda principal"
        :rules="[notEmpty]"
      >
        <template v-slot:selected>
          <div v-if="mainCurrency">
            <q-chip>
              <q-avatar>
                <img :src="getCurrencyImage(mainCurrency.value)" />
              </q-avatar>
              &nbsp; {{ mainCurrency.label }}
            </q-chip>
          </div>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section avatar>
              <img :src="getCurrencyImage(scope.opt.value)" :alt="scope.opt.label" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="otherCurrencies"
        multiple
        :options="mainCurrency ? otherCurrenciesOptions : []"
        use-chips
        label="Otras monedas (Opcional)"
        :disable="!mainCurrency"
      >
        <template v-slot:selected>
          <div v-for="otherCurrency in otherCurrencies" :key="otherCurrency.value">
            <q-chip>
              <q-avatar>
                <img :src="getCurrencyImage(otherCurrency.value)" />
              </q-avatar>
              &nbsp; {{ otherCurrency.label }}
            </q-chip>
          </div>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section avatar>
              <img :src="getCurrencyImage(scope.opt.value)" :alt="scope.opt.label" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- <q-input v-model="password" label="Contraseña (Opcional)" lazy-rules type="password" /> -->

      <h5 class="text-center title">Participantes</h5>
      <q-separator />

      <!-- TODO: participants name should be different -->
      <!-- TODO: Only letters -->
      <div v-for="n in participantsAmount" :key="n" class="flex">
        <q-input
          v-model="participants[n - 1]"
          :label="n === 1 ? 'Tu nombre' : 'El nombre de tu amigo'"
          lazy-rules
          :rules="[notEmpty, validVariable, val => unique(val, getFilteredParticipants(n))]"
          class="participant-input col-grow"
        />
        <q-btn
          label="Eliminar"
          color="red"
          class="self-center"
          @click="deleteParticipant(n)"
          :disable="participantsAmount <= minParticipantAmount"
        />
      </div>
      <q-btn
        label="Agregar participante"
        class="add-participant-btn full-width q-mt-md"
        color="secondary"
        @click="addParticipant"
      />

      <div class="flex form-buttons">
        <q-btn label="Crear" type="submit" class="col-grow" color="primary" />
        <q-btn label="Limpiar" type="reset" class="col-grow q-ml-sm" color="primary" flat />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { notEmpty, validVariable, unique } from '@/utils/formValidations';
import currencies from '@/utils/currencies';
const MIN_PARTICIPANT_AMOUNT = 2;

export default {
  name: 'PageNewEvent',
  data() {
    return {
      notEmpty,
      validVariable,
      unique,
      currencyOptions: currencies,
      eventName: null,
      password: null,
      mainCurrency: null,
      otherCurrencies: [],
      participants: [],
      participantsAmount: MIN_PARTICIPANT_AMOUNT,
      minParticipantAmount: MIN_PARTICIPANT_AMOUNT,
    };
  },
  computed: {
    otherCurrenciesOptions() {
      const mainCurrency = this.mainCurrency;
      return this.currencyOptions.filter(c => c.value !== mainCurrency.value);
    },
  },
  methods: {
    getCurrencyImage(value) {
      return require(`../assets/images/currencies/${value.toLowerCase()}.png`);
    },
    getFilteredParticipants(n) {
      return this.participants.filter((p, i) => i !== n - 1);
    },
    addParticipant() {
      this.participantsAmount++;
    },
    deleteParticipant(n) {
      if (this.participants.length >= n) {
        const participants = this.participants.slice(0);
        participants.splice(n - 1, 1);
        this.participants = participants;
      }
      this.participantsAmount--;
    },
    onSubmit() {
      this.$store
        .dispatch('CREATE_EVENT', {
          eventName: this.eventName,
          mainCurrency: this.mainCurrency,
          password: this.password,
          otherCurrencies: this.otherCurrencies,
          participants: this.participants,
        })
        .then(eventId => {
          this.$router.push({ name: 'event', params: { eventId: eventId } });
        })
        .catch(e => {
          this.$store.commit('SET_IS_LOADING', false);
          console.error(e);
          this.$q.notify({
            color: 'red',
            textColor: 'white',
            icon: 'error',
            message: 'El evento no pudo ser creado',
          });
        });
    },
    onReset() {
      this.eventName = null;
      this.mainCurrency = null;
      this.password = null;
      this.otherCurrencies = [];
      this.participants = [];
      this.participantsAmount = MIN_PARTICIPANT_AMOUNT;
    },
  },
};
</script>

<style scoped>
.q-page {
  padding: 1rem;
}
.title {
  margin: 1rem 0;
}
.q-item__section--avatar {
  min-width: 0 !important;
}
.form-buttons {
  margin: 1rem 0;
}
</style>
