// currencyScheduler.js
const axios = require('axios');
const cron = require('node-cron');

let cachedRate = 83.2;

const fetchExchangeRate = async () => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    cachedRate = response.data.rates.INR;
    console.log('INR rate updated:', cachedRate);
  } catch (error) {
    console.error('Error fetching rate:', error.message);
  }
};

// ⏰ Run every 55 minutes
cron.schedule('*/55 * * * *', fetchExchangeRate);

// 👟 Initial fetch on server startup
fetchExchangeRate();

const convertToINR = (usd) => parseFloat((usd * cachedRate).toFixed(2));

module.exports = { convertToINR, getCachedRate: () => cachedRate };
