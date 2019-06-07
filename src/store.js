import Vue from 'vue';
import Vuex from 'vuex';
import { getExchangeRates } from '@/api/currency';

import fb from '@/api/firebaseManager';
import { storeEvent } from '@/api/localStorage';
import uuid from 'uuid/v1';

Vue.use(Vuex);
/**
 * Transaction data format:
 * {
 *   "amount": "150",
 *   "concept": "Alojamiento",
 *   "currency": "USD",
 *   "date": "31-05-2019",
 *   "payer": "Santiago",
 *   "splitBetween": ["Exe", "Diego"]
 * }
 */
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
    UPDATE_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
    },
    UPDATE_OTHER_CURRENCIES(state, otherCurrencies) {
      state.otherCurrencies = otherCurrencies;
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
          commit('SET_EVENT', { ...event, id: docRef.id });
          storeEvent({ name: eventData.eventName, id: docRef.id });
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
            const event = doc.data()
            commit('SET_EVENT', { ...event, eventId: doc.id });
            storeEvent({ name: event.eventName, id: doc.id });
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
      const transaction = { ...transactionData, id: uuid() };
      return fb.eventCollection
        .doc(state.eventId)
        .update({
          transactions: state.transactions.concat(transaction),
        })
        .then(() => {
          commit('ADD_TRANSACTION', transaction);
        })
        .finally(() => {
          commit('SET_IS_LOADING', false);
        });
    },
    async UPDATE_TRANSACTION({ state, commit }, transaction) {
      commit('SET_IS_LOADING', true);
      if (!state.eventId) {
        return Promise.reject('No existe evento');
      }
      const newTransactions = state.transactions
        .filter(t => t.id !== transaction.id)
        .concat(transaction);
      return fb.eventCollection
        .doc(state.eventId)
        .update({
          transactions: newTransactions,
        })
        .then(() => {
          commit('UPDATE_TRANSACTIONS', newTransactions);
        })
        .finally(() => {
          commit('SET_IS_LOADING', false);
        });
    },
    async DELETE_TRANSACTION({ state, commit }, transaction) {
      commit('SET_IS_LOADING', true);
      if (!state.eventId) {
        return Promise.reject('No existe evento');
      }
      const filteredTransactions = state.transactions.filter(t => t.id !== transaction.id);
      return fb.eventCollection
        .doc(state.eventId)
        .update({
          transactions: filteredTransactions,
        })
        .then(() => {
          commit('UPDATE_TRANSACTIONS', filteredTransactions);
        })
        .finally(() => {
          commit('SET_IS_LOADING', false);
        });
    },
    async UPDATE_CURRENCY({ state, commit }, currency) {
      commit('SET_IS_LOADING', true);
      if (!state.eventId) {
        return Promise.reject('No existe evento');
      }
      const updatedCurrencies = state.otherCurrencies.map(c => {
        if (c.value === currency.value) {
          return currency;
        }
        return c;
      });
      return fb.eventCollection
        .doc(state.eventId)
        .update({
          otherCurrencies: updatedCurrencies,
        })
        .then(() => {
          commit('UPDATE_OTHER_CURRENCIES', updatedCurrencies);
        })
        .finally(() => {
          commit('SET_IS_LOADING', false);
        });
    },
    async AUTO_UPDATE_CURRENCY({ state, commit, dispatch }, currency) {
      commit('SET_IS_LOADING', true);

      try {
        const rates = await getExchangeRates(state.mainCurrency.value, [currency.value]);
        return dispatch('UPDATE_CURRENCY', { ...currency, rate: rates[0] });
      } catch (e) {
        commit('SET_IS_LOADING', false);
        return Promise.reject(e);
      }
    },
  },
  getters: {
    allCurrencies(state) {
      return [state.mainCurrency, ...state.otherCurrencies];
    },
  },
});
