const assets = require('./assets');

const priceState = {}; 

assets.forEach(asset => {
  priceState[asset.symbol] = {
    price: asset.basePrice,
    history: [asset.basePrice],
  };
});

function updatePrices() {
  Object.keys(priceState).forEach(symbol => {
    const prev = priceState[symbol].price;
    const volatility = 0.03; // 3% swing
    const change = (Math.random() * 2 - 1) * volatility;
    const next = Math.max(prev * (1 + change), 1);
    priceState[symbol].price = parseFloat(next.toFixed(2));
    priceState[symbol].history.push(next);
  });
}

function getCurrentPrices() {
  // Convert all prices to INR using the cached exchange rate
  return Object.fromEntries(
    Object.entries(priceState).map(([symbol, data]) => [symbol, data.price])

  );
}

module.exports = { updatePrices, getCurrentPrices };
