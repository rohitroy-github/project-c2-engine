// priceEngine.js
const { getAllStates, getCurrentPrices } = require('./priceManager');

function updatePrices() {
  const allStates = getAllStates();

  Object.entries(allStates).forEach(([symbol, state]) => {
    let next;

    if (
      state.predictedPrices.length > 0 &&
      state.injectIndex < state.predictedPrices.length
    ) {
      // ✅ Use predicted percentage change
      const pctChange = state.predictedPrices[state.injectIndex] / 100;

      // Apply change to last price
      next = state.price * (1 + pctChange);

      // Add small random noise so it's not fully predictable
      const noise = (Math.random() * 0.004 - 0.002) * state.price; // ±0.2%
      next += noise;

      state.injectIndex++;
    } else {
      // ✅ Normal random walk when no model injection
      const volatility = 0.02; // ~2% max random change
      const change = (Math.random() * 2 - 1) * volatility;
      next = Math.max(state.price * (1 + change), 1);
    }

    // Update price with safe rounding
    state.price = parseFloat(next.toFixed(2));

    // Keep history updated
    state.history.push(state.price);
    if (state.history.length > 100) state.history.shift();
  });
}

module.exports = {
  updatePrices,
  getCurrentPrices,
  startModelTrigger: require('../crons/modelTrigger').maybeTriggerModelCall
};
