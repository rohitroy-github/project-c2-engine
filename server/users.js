const assets = require("./assets");

const users = {};

function createUser(name) {
  const initialHoldings = {};
  assets.forEach((asset) => {
    initialHoldings[asset.symbol] = {
      quantity: 0,
      costBasis: 0,
    };
  });

  users[name] = {
    username: name,
    initialUsd: 10000,
    usd: 10000,
    holdings: initialHoldings,
    pnl: 0,
    realizedPNL: 0,
    unrealizedPNL: 0,
  };
}

function trade(user, symbol, side, amountUSD, price) {
  const quantity = amountUSD / price;

  if (side === "BUY") {
    if (users[user].usd < amountUSD) {
      return {
        success: false,
        message: "Insufficient funds for this buy order.",
      };
    }

    const holding = users[user].holdings[symbol] || {
      quantity: 0,
      costBasis: 0,
    };
    const totalCost = holding.quantity * holding.costBasis + amountUSD;
    const newQuantity = holding.quantity + quantity;

    // New average cost basis
    const newCostBasis = totalCost / newQuantity;

    users[user].usd -= amountUSD;

    users[user].holdings[symbol] = {
      quantity: newQuantity,
      costBasis: newCostBasis,
    };
    return { success: true, message: "Buy executed successfully" };
  } else if (side === "SELL") {
    const holding = users[user].holdings[symbol];
    if (!holding || holding.quantity < quantity) {
      return {
        success: false,
        message: `Insufficient ${symbol} holdings for this sell order`,
      };
    }

    // Realized Profit = (sell price - cost basis) * quantity
    const cost = quantity * holding.costBasis;
    const revenue = amountUSD;
    const pnl = revenue - cost;

    // Adjust holdings
    holding.quantity -= quantity;

    if (holding.quantity <= 0) {
      delete users[user].holdings[symbol];
    }

    users[user].usd += amountUSD;
    users[user].realizedPNL += parseFloat(pnl.toFixed(2));

    return {
      success: true,
      message: "Sell executed successfully",
    };
  } else {
    return {
      success: false,
      message: "Invalid trade side",
    };
  }
}

function calculatePNL(user, prices) {
  let unrealizedPNL = 0;

  // Loop through holdings
  for (const symbol in users[user].holdings) {
    const holding = users[user].holdings[symbol];
    unrealizedPNL += holding.quantity * (prices[symbol] - holding.costBasis);
  }

  // Save the calculated unrealized PNL
  users[user].unrealizedPNL = parseFloat(unrealizedPNL.toFixed(2));

  // Final total PNL = Realized + Unrealized
  users[user].pnl = parseFloat(
    (users[user].realizedPNL + unrealizedPNL).toFixed(2)
  );

  return users[user].pnl;
}

module.exports = { users, createUser, trade, calculatePNL };
