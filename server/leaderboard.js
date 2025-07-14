const { users } = require('./users');

function getLeaderboard() {
  const leaderboard = Object.entries(users)
    .map(([name, data]) => {
      const holdings = Object.entries(data.holdings || {})
        .filter(([_, holding]) => holding.quantity > 0)
        .map(([symbol, holding]) => ({
          symbol,
          quantity: parseFloat(holding.quantity.toFixed(4)), // quantity
          costBasis: parseFloat(holding.costBasis.toFixed(2)), // optional
        }));

      return {
        name,
        pnl: data.pnl,
        holdings,
        realizedPNL: parseFloat(data.realizedPNL.toFixed(2)),
        unrealizedPNL: parseFloat(data.unrealizedPNL.toFixed(2)),
      };
    })
    .sort((a, b) => b.pnl - a.pnl);

  if (leaderboard.length === 0) {
    return { message: 'Leaderboard is empty.', leaderboard: [] };
  }

  return {
    message: 'Leaderboard fetched successfully.',
    leaderboard,
  };
}

module.exports = { getLeaderboard };
