// modelTrigger.js
const { fetchPredictedPrices } = require('./modelCaller');
const { getSymbols, getSymbolHistory, injectModelPrices } = require('../utils/priceManager');

function getRandomDelay(minSeconds = 10, maxSeconds = 30) {
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
}

async function maybeTriggerModelCall() {
  const delay = getRandomDelay();

  setTimeout(async () => {
    const symbols = getSymbols();
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const history = getSymbolHistory(randomSymbol).slice(-5).map(p => parseFloat(p.toFixed(2)));

    const result = await fetchPredictedPrices(randomSymbol, history);

    if (result && result.predicted.length > 0) {
      injectModelPrices(randomSymbol, result.predicted);
      console.log(`[${randomSymbol}] Injected with prompt: "${result.prompt}"`);
    }

    maybeTriggerModelCall(); // Recursively schedule next
  }, delay);
}

module.exports = { maybeTriggerModelCall };
