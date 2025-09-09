// priceManager.js
const assets = require('../assets');

const priceState = {};

assets.forEach(asset => {
  priceState[asset.symbol] = {
    price: asset.basePrice,
    history: [asset.basePrice],
    predictedPrices: [],
    injectIndex: 0,
  };
});

function getState(symbol) {
  return priceState[symbol];
}

function getAllStates() {
  return priceState;
}

function getCurrentPrices() {
  return Object.fromEntries(Object.entries(priceState).map(([symbol, data]) => [symbol, data.price]));
}

function getSymbolHistory(symbol) {
  return priceState[symbol]?.history || [];
}

function getSymbols() {
  return Object.keys(priceState);
}

function injectModelPrices(symbol, predictedArray) {
  priceState[symbol].predictedPrices = predictedArray;
  priceState[symbol].injectIndex = 0;
}

module.exports = {
  getState,
  getAllStates,
  getCurrentPrices,
  getSymbolHistory,
  getSymbols,
  injectModelPrices
};
