import axiosFactory from 'axios';

const baseDomain = 'https://free.currconv.com';
const baseURL = `${baseDomain}/api/v7/convert?compact=ultra&apiKey=${
  process.env.VUE_APP_CURRENCY_API_TOKEN
}&q=`;

const axios = axiosFactory.create({
  baseURL,
});

export const getExchangeRates = (currency, currencies) => {
  const query = currencies.map(c => `${currency}_${c}`).join(',');
  return axios.get(query).then(response => Object.values(response.data));
};
