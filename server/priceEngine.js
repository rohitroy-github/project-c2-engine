const assets = require('./assets');
const { fetchPredictedPrices } = require('./modelCaller');

const priceState = {};

assets.forEach(asset => {
  priceState[asset.symbol] = {
    price: asset.basePrice,
    history: [asset.basePrice],
    predictedPrices: [],       // Injected model output
    injectIndex: 0             // Where we are in prediction
  };
});



function updatePrices() {
  Object.keys(priceState).forEach(symbol => {
    const state = priceState[symbol];

    if (state.predictedPrices.length > 0 && state.injectIndex < state.predictedPrices.length) {
      // Injecting from predicted array
      const next = state.predictedPrices[state.injectIndex];
      state.injectIndex++;
      state.price = parseFloat(next.toFixed(2));
      state.history.push(next);

      if (state.history.length > 100) state.history.shift(); // Limit history size
    } else {
      // Use normal generator
      const prev = state.price;
      const volatility = 0.03;
      const change = (Math.random() * 2 - 1) * volatility;
      const next = Math.max(prev * (1 + change), 1);
      state.price = parseFloat(next.toFixed(2));
      state.history.push(next);

      if (state.history.length > 100) state.history.shift(); // Limit history size
    }
  });
}

// function updatePrices() {
//   Object.keys(priceState).forEach(symbol => {
//     const prev = priceState[symbol].price;
//     const volatility = 0.03; // 3% swing
//     const change = (Math.random() * 2 - 1) * volatility;
//     const next = Math.max(prev * (1 + change), 1);
//     priceState[symbol].price = parseFloat(next.toFixed(2));
//     priceState[symbol].history.push(next);
//   });
// }

function getCurrentPrices() {
  // Convert all prices to INR using the cached exchange rate
  return Object.fromEntries(
    Object.entries(priceState).map(([symbol, data]) => [symbol, data.price])

  );
}

function getRandomDelay(minSeconds = 10, maxSeconds = 30) {
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
}

async function maybeTriggerModelCall() {
  const delay = getRandomDelay(); // random delay between 60s to 5min
  setTimeout(async () => {
    const symbols = Object.keys(priceState);
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const state = priceState[randomSymbol];

    // Only trigger if there are no predictions queued
    if (state.predictedPrices.length === 0) {
      const history = state.history.slice(-5).map(p => parseFloat(p.toFixed(2)));
      const result = await fetchPredictedPrices(randomSymbol, history);

      if (result && result.predicted.length > 0) {
        state.predictedPrices = result.predicted;
        state.injectIndex = 0;
        console.log(`[${randomSymbol}] Model injected with prompt: "${result.prompt}"`);
      }
    }

    // Schedule next call
    maybeTriggerModelCall();
  }, delay);
}

module.exports = { updatePrices, getCurrentPrices, maybeTriggerModelCall };
