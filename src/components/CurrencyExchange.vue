<template>
  <div class="currecies-exchange">
    <div
      v-for="currency in otherCurrencies"
      :key="currency.value"
      class="currecies-exchange--container"
    >
      <q-chip square class="currecies-exchange--entry">
        <q-avatar>
          <img :src="getCurrencyImage(mainCurrency.value)" />
        </q-avatar>
        <span class="text-center"> 1 = {{ getCurrencyExclange(1, currency) }} </span>
        <q-avatar class="right-avatar">
          <img :src="getCurrencyImage(currency.value)" />
        </q-avatar>
      </q-chip>
      <q-chip square class="currecies-exchange--entry">
        <q-avatar>
          <img :src="getCurrencyImage(currency.value)" />
        </q-avatar>
        <span class="text-center"> 1 = {{ getCurrencyExclange(1, currency, true) }} </span>
        <q-avatar class="right-avatar">
          <img :src="getCurrencyImage(mainCurrency.value)" />
        </q-avatar>
      </q-chip>
      <div class="show-rate currecies-exchange--entry">
        <q-input
          class="show-rate--input"
          :disable="isCurrencyInputDisable(currency.value)"
          filled
          dense
          :value="currency.rate"
          label="Rate"
          @keyup.enter="updateCurrencyRate(currency, $event.target.value)"
          :ref="`${currency.value}-input`"
        />
        <q-btn
          size="sm"
          color="secondary"
          :icon="isCurrencyInputDisable(currency.value) ? 'edit' : 'check'"
          @click="onEditClick(currency)"
        />
        <q-btn
          size="sm"
          color="secondary"
          icon="cloud_download"
          @click="onDonwloadCurrencyRateClick(currency)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { round } from '@/utils/format';

function searchTree(element, tag) {
  if (element.tagName == tag) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], tag);
    }
    return result;
  }
  return null;
}
export default {
  name: 'currencyExchangeRates',
  data() {
    return {
      currencyInputEnables: [],
    };
  },
  computed: {
    mainCurrency() {
      return this.$store.state.mainCurrency;
    },
    otherCurrencies() {
      return this.$store.state.otherCurrencies;
    },
  },
  methods: {
    getCurrencyImage(value) {
      return require(`../assets/images/currencies/${value.toLowerCase()}.png`);
    },
    getCurrencyExclange(value, currency, invert = false) {
      if (invert) {
        return round(value / currency.rate, 3);
      }
      return round(value * currency.rate, 3);
    },
    onEditClick(currency) {
      if (this.isCurrencyInputDisable(currency.value)) {
        this.currencyInputEnables.push(currency.value);
      } else {
        const qInputElement = this.$refs[`${currency.value}-input`].find(e => e).$el;
        const input = searchTree(qInputElement, 'INPUT');
        this.updateCurrencyRate(currency, input.value);
      }
    },
    isCurrencyInputDisable(currencyValue) {
      return !this.currencyInputEnables.includes(currencyValue);
    },
    updateCurrencyRate(currency, newRate) {
      this.currencyInputEnables = this.currencyInputEnables.filter(c => c !== currency.value);
      this.$store
        .dispatch('UPDATE_CURRENCY', { ...currency, rate: newRate })
        .catch(this.showErrorMessage);
    },
    onDonwloadCurrencyRateClick(currency) {
      this.$store.dispatch('AUTO_UPDATE_CURRENCY', currency).catch(this.showErrorMessage);
    },
    //TODO: Move this error Message to a general place
    showErrorMessage(e) {
      this.$q.notify({
        color: 'red',
        textColor: 'white',
        icon: 'error',
        message: 'No se pudo actualizar la moneda' + e,
      });
    },
  },
};
</script>

<style scoped>
.currecies-exchange {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.currecies-exchange--container {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}
.currecies-exchange--entry {
  min-width: 10rem;
  position: relative;
}
.text-center {
  width: 6rem;
}
.q-chip {
  min-width: 11rem;
}
.right-avatar {
  position: absolute !important;
  right: 0;
  margin-right: 0 !important;
}
.show-rate {
  display: inline-flex;
  /* transform: translateY(7px); */
  margin: 4px;
}
.show-rate--input {
  width: 6rem;
}
.q-btn {
  margin-left: 0.5rem;

  padding: 0.5rem !important;
}
</style>
