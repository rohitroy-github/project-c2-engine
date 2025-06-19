const { users } = require('./users');

function getLeaderboard() {
  return Object.entries(users)
    .map(([name, data]) => ({
      name,
      pnl: data.pnl,
    }))
    .sort((a, b) => b.pnl - a.pnl);
}

module.exports = { getLeaderboard };
