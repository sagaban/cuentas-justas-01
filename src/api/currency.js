import axiosFactory from 'axios';

const baseDomain = 'https://free.currconv.com';
const baseURL = `${baseDomain}/api/v7`;

const axios = axiosFactory.create({
  baseURL,
  params: {
    compact: 'ultra',
    apiKey: process.env.VUE_APP_CURRENCY_API_TOKEN,
  },
});

export const getExchangeRates = (currency, currencies) => {
  const q = currencies.map(c => `${currency}_${c}`).join(',');
  return axios
    .get('convert', {
      params: {
        q,
      },
    })
    .then(response => {
      return Object.values(response.data);
    });
};
