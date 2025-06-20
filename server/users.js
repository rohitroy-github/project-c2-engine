const users = {}; 

function createUser(name) {
  users[name] = {
    username: name,
    usd: 10000,
    holdings: {},
    initialUsd: 10000,
    pnl: 0,
  };
}


function trade(user, symbol, side, amountUSD, price) {
  const quantity = amountUSD / price;

  if (side === 'BUY') {
    if (users[user].usd < amountUSD) {
      return { success: false, message: 'Insufficient USD balance for this buy order' };
    }
    users[user].usd -= amountUSD;
    users[user].holdings[symbol] = (users[user].holdings[symbol] || 0) + quantity;
  } 
  else if (side === 'SELL') {
    if ((users[user].holdings[symbol] || 0) < quantity) {
      return { success: false, message: `Insufficient ${symbol} holdings for this sell order` };
    }
    users[user].usd += amountUSD;
    users[user].holdings[symbol] -= quantity;
  } 
  else {
    return { success: false, message: 'Invalid trade side' };
  }

  return { success: true, message: 'Trade executed successfully' };
}


// function trade(user, symbol, side, amountUSD, price) {
//   const quantity = amountUSD / price;
//   if (side === 'BUY') {
//     if (users[user].usd < amountUSD) return false;
//     users[user].usd -= amountUSD;
//     users[user].holdings[symbol] = (users[user].holdings[symbol] || 0) + quantity;
//   } else {
//     if ((users[user].holdings[symbol] || 0) < quantity) return false;
//     users[user].usd += amountUSD;
//     users[user].holdings[symbol] -= quantity;
//   }
//   return true;
// }

function calculatePNL(user, prices) {
  let total = users[user].usd;
  for (const symbol in users[user].holdings) {
    total += users[user].holdings[symbol] * prices[symbol];
  }
  users[user].pnl = parseFloat((total - users[user].initialUsd).toFixed(2));
  return users[user].pnl;
}

module.exports = { users, createUser, trade, calculatePNL };
