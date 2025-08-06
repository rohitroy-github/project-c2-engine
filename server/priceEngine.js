// priceEngine.js
const { getAllStates, getState, getCurrentPrices } = require('./priceManager');
const { maybeTriggerModelCall } = require('./modelTrigger');

function updatePrices() {
  const allStates = getAllStates();

  Object.entries(allStates).forEach(([symbol, state]) => {
    if (state.predictedPrices.length > 0 && state.injectIndex < state.predictedPrices.length) {
      // Inject model-predicted price
      const next = state.predictedPrices[state.injectIndex];
      state.injectIndex++;
      state.price = parseFloat(next.toFixed(2));
    } else {
      // Simulate normal price movement
      const volatility = 0.03;
      const change = (Math.random() * 2 - 1) * volatility;
      const next = Math.max(state.price * (1 + change), 1);
      state.price = parseFloat(next.toFixed(2));
    }

    // Update price history
    state.history.push(state.price);
    if (state.history.length > 10) state.history.shift();
  });
}

module.exports = {
  updatePrices,
  getCurrentPrices,
  startModelTrigger: maybeTriggerModelCall
};
