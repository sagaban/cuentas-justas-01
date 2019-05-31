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
      state.transactions = eventData.transactions;
    },
    SET_IS_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    ADD_TRANSACTION(state, transactionData) {
      state.transactions = state.transactions.concat(transactionData);
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

      const event = { ...eventData, otherCurrencies, transactions: [] };

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
            commit('SET_EVENT', { ...doc.data(), eventId: doc.id });
          } else {
            return Promise.reject('No existe el evento');
          }
        });
    },
    async ADD_TRANSACTION({ state, commit }, transactionData) {
      commit('SET_IS_LOADING', true);
      if (!state.eventId) {
        return Promise.reject('No existe evento');
      }
      return fb.eventCollection
        .doc(state.eventId)
        .update({
          transactions: state.transactions.concat(transactionData),
        })
        .then(() => {
          commit('ADD_TRANSACTION', transactionData);
        })
        .finally(() => {
          console.log('Se ejecuta esto?');
          commit('SET_IS_LOADING', false);
        });
    },
  },
  getters: {
    allCurrencies(state) {
      return [state.mainCurrency, ...state.otherCurrencies];
    },
  },
});
