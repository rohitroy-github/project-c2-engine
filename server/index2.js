const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const { updatePrices, getCurrentPrices, maybeTriggerModelCall } = require('./priceEngine');
const { users, createUser, trade, calculatePNL } = require('./users');
const { getLeaderboard } = require('./leaderboard');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// POST /user
app.post('/user', (req, res) => {
  const { name } = req.body;
  console.log(`👉 [POST] /user | Payload:`, req.body);

  if (!users[name]) {
    createUser(name);
    console.log(`✅ User '${name}' created.`);
  } else {
    console.log(`⚠️ User '${name}' already exists.`);
  }

  res.send({ msg: "User created", balance: users[name] });
});

// POST /trade
app.post('/trade', (req, res) => {
  const { user, symbol, side, amountUSD } = req.body;
  console.log(`👉 [POST] /trade | User: ${user} | Symbol: ${symbol} | Side: ${side} | Amount: ₹${amountUSD}`);

  const prices = getCurrentPrices();
  const currentPrice = prices[symbol];
  console.log(`📊 Current Price of ${symbol}: ₹${currentPrice}`);

  const success = trade(user, symbol, side, amountUSD, currentPrice);
  const pnl = calculatePNL(user, prices);

  console.log(`💹 Trade ${success ? 'executed' : 'failed'} | PnL: ₹${pnl.toFixed(2)}`);
  console.log(`📦 Updated Portfolio for ${user}:`, users[user]);

  res.send({ success, user: users[user] });
});

// GET /leaderboard
app.get('/leaderboard', (req, res) => {
  console.log(`📥 [GET] /leaderboard`);
  const board = getLeaderboard();
  console.log(`🏆 Leaderboard Sent:`, board);
  res.send(board);
});

// Price update loop
setInterval(async() => {
  await maybeTriggerModelCall();  // Random model call
  updatePrices();  
  const prices = getCurrentPrices();

  for (const user in users) {
    calculatePNL(user, prices);
  }

  const leaderboard = getLeaderboard();
  console.log(`🔄 Prices Updated:`, prices);
  io.emit('prices', { prices, leaderboard });
}, 500);

server.listen(5000, () => console.log('🚀 Server running on port 3000'));
