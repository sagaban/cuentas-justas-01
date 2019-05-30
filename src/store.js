import Vue from 'vue';
import Vuex from 'vuex';
import { getExchangeRates } from '@/api/currency';

import fb from '@/api/firebaseManager';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    eventId: null,
    eventName: null,
    mainCurrency: null,
    otherCurrencies: [],
    participants: [],
    transactions: [],
  },
  mutations: {
    SET_EVENT(state, eventData) {
      state.eventId = eventData.eventId;
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
          commit('SET_IS_LOADING', false);
          return Promise.reject(e);
        }
      }

      const event = { ...eventData, otherCurrencies };

      return fb.eventCollection
        .add(event)
        .then(docRef => {
          commit('SET_EVENT', { ...event, eventId: docRef.id });
          return docRef.id;
        })
        .catch(function(error) {
          return Promise.reject(error);
        })
        .finally(() => {
          commit('SET_IS_LOADING', false);
        });
    },
    LOAD_EVENT({ commit }, eventId) {
      commit('SET_IS_LOADING', true);
      return fb.eventCollection
        .doc(eventId)
        .get()
        .then(doc => {
          commit('SET_IS_LOADING', false);
          if (doc.exists) {
            commit('SET_EVENT', doc.data());
          } else {
            return Promise.reject('No existe el evento');
          }
        });
    },
  },
});
