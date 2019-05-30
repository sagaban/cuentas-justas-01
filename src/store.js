import Vue from 'vue';
import Vuex from 'vuex';
import { getExchangeRates } from '@/api/currency';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    eventName: null,
    mainCurrency: null,
    otherCurrencies: [],
    participants: [],
  },
  mutations: {
    SET_NEW_EVENT(state, eventData) {
      state.eventName = eventData.eventName;
      state.mainCurrency = eventData.mainCurrency;
      state.otherCurrencies = eventData.otherCurrencies;
      state.participants = eventData.participants;
    },
    SET_IS_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    async CREATE_EVENT({ commit }, eventData) {
      commit('SET_IS_LOADING', true);
      let otherCurrencies = [];
      if (eventData.otherCurrencies && eventData.otherCurrencies.length > 0) {
        try {
          const currenciesCodes = eventData.otherCurrencies.map(c => c.value);
          const rates = await getExchangeRates(eventData.mainCurrency.value, currenciesCodes);
          otherCurrencies = eventData.otherCurrencies.map((c, i) => {
            return { ...c, rate: rates[i] };
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
      commit('SET_IS_LOADING', false);

      //TODO: Save to firebase

      commit('SET_NEW_EVENT', { ...eventData, otherCurrencies });
    },
  },
});
