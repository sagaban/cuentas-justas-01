<template>
  <q-page>
    <h5 class="text-center title">Nueva transacción</h5>
    <q-separator />
    <q-form ref="newEvent" @submit="onSubmit">
      <!-- TODO: Make a user as selected and populate this field -->
      <q-select v-model="payer" :options="payerOptions" label="¿Quien pagó?" :rules="[notEmpty]" />
      <q-input v-model="concept" label="¿En concepto de qué?" />
      <q-input v-model="amount" label="¿Cuánto dolió?" type="number" :rules="[notEmpty]" />
      <div class="q-pa-md currency-container" v-if="currenciesOptions.length > 1">
        <div v-for="currencyOption in currenciesOptions" :key="currencyOption.value">
          <q-radio v-model="currency" :val="currencyOption.value">
            <img :src="getCurrencyImage(currencyOption.value)" :alt="currencyOption.value" /> &nbsp;
            {{ currencyOption.value }}
          </q-radio>
        </div>
      </div>
      <q-input label="Fecha" v-model="date">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" :mask="dateMask" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div class="split-beetwen-container">
        <span class="text-subtitle1">A dividir entre:</span>
        <div class="split-beetwen-container__options">
          <div v-for="leech in splitBeetwenOptions" :key="leech">
            <q-checkbox v-model="splitBeetwen" :val="leech" :label="leech" />
          </div>
        </div>
      </div>
      <div class="flex form-buttons">
        <q-btn label="Crear" type="submit" class="col-grow" color="primary" />
        <q-btn
          label="Cancelar"
          type="reset"
          class="col-grow q-ml-sm"
          @click="onCancel"
          color="primary"
          flat
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/utils/constants';
import { notEmpty } from '@/utils/formValidations';

export default {
  name: 'PageNewTranscation',
  beforeCreate() {
    if (this.$store.state.eventId !== this.$route.params.id) {
      //TODO: Move this to a mixin or something
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
  updated() {
    // TODO: Check this when offline/local stores is activated
    if (!this.currency && this.$store.state.mainCurrency) {
      this.currency = this.$store.state.mainCurrency.value;
    }
  },
  data() {
    return {
      notEmpty,
      payer: null,
      concept: null,
      amount: null,
      currency: null,
      splitBeetwen: [],
      date: dayjs().format(DATE_FORMAT),
      dateMask: DATE_FORMAT,
    };
  },
  computed: {
    payerOptions() {
      return this.$store.state.participants;
    },
    currenciesOptions() {
      return this.$store.getters.allCurrencies;
    },
    splitBeetwenOptions() {
      return this.payerOptions.filter(p => p !== this.payer);
    },
  },
  methods: {
    getCurrencyImage(value) {
      return require(`../assets/images/currencies/${value.toLowerCase()}.png`);
    },
    onSubmit() {
      this.$store
        .dispatch('ADD_TRANSACTION', {
          payer: this.payer,
          concept: this.concept,
          amount: this.amount,
          currency: this.currency,
          splitBeetwen: this.splitBeetwen,
          date: this.date,
        })
        .then(() => {
          this.$router.push({ name: 'event', params: { id: this.$store.state.eventId } });
        })
        .catch(e => {
          this.$store.commit('SET_IS_LOADING', false);
          console.error(e);
          this.$q.notify({
            color: 'red',
            textColor: 'white',
            icon: 'error',
            message: 'La transacción no pudo ser creada',
          });
        });
    },
    onCancel() {
      this.$router.push({ name: 'event', params: { id: this.$store.state.eventId } });
    },
  },
  watch: {
    payer() {
      this.splitBeetwen = this.splitBeetwenOptions;
    },
  },
};
</script>

<style scoped>
.q-page {
  padding: 1rem;
}
.title {
  margin: 0.5rem 0;
}
.q-form > * {
  margin: 0.5rem 0;
}
.currency-container {
  display: flex;
  justify-content: space-evenly;
  padding: 0.5rem;
}
.split-beetwen-container__options {
  display: flex;
}
.split-beetwen-container__options > div {
  margin-right: 1rem;
}
.form-buttons {
  margin-top: 2rem;
}
</style>
