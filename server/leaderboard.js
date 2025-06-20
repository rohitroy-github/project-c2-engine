const { users } = require('./users');

function getLeaderboard() {
  const leaderboard = Object.entries(users)
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

  if (leaderboard.length === 0) {
    return { message: 'Leaderboard is empty.', leaderboard: [] };
  }

  return { message: 'Leaderboard fetched successfully.', leaderboard };
}

module.exports = { getLeaderboard };
