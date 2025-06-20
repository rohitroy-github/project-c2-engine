const { users } = require('./users');

function getLeaderboard() {
  return Object.entries(users)
    .map(([name, data]) => ({
      name,
      pnl: data.pnl,
      holdings: Object.entries(data.holdings)
        .filter(([_, qty]) => qty > 0)
        .map(([symbol, qty]) => ({
          symbol,
          quantity: parseFloat(qty.toFixed(4))  // limit decimal places for display
        }))
    }))
    .sort((a, b) => b.pnl - a.pnl);
}

module.exports = { getLeaderboard };


// ### PNL with just the name and PNL value
// const { users } = require('./users');

// function getLeaderboard() {
//   return Object.entries(users)
//     .map(([name, data]) => ({
//       name,
//       pnl: data.pnl,
//     }))
//     .sort((a, b) => b.pnl - a.pnl);
// }

// module.exports = { getLeaderboard };
