import Vue from 'vue';

export const storeEvent = eventData => {
  const storedEventList = getStoredEventList();
  const isEventIncluded = !!storedEventList.find(e => e.id === eventData.id);
  if (!isEventIncluded) {
    storedEventList.push(eventData);
    Vue.storage.set('eventList', storedEventList);
  }
};

export const getStoredEventList = () => {
  return Vue.storage.get('eventList', []);
};
