const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { updatePrices, getCurrentPrices } = require("./priceEngine");
const { users, createUser, trade, calculatePNL } = require("./users");
const { getLeaderboard } = require("./leaderboard");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// POST /user
app.post("/user", (req, res) => {
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
app.post("/trade", (req, res) => {
  const { user, symbol, side, amountUSD } = req.body;
  console.log(
    `👉 [POST] /trade | User: ${user} | Symbol: ${symbol} | Side: ${side} | Amount: $${amountUSD}`
  );

  const prices = getCurrentPrices();
  const currentPrice = prices[symbol];
  console.log(`📊 Current Price of ${symbol}: $${currentPrice}`);

  const success = trade(user, symbol, side, amountUSD, currentPrice);
  const pnl = calculatePNL(user, prices);

  console.log(
    `💹 Trade ${success ? "executed" : "failed"} | PnL: $${pnl.toFixed(2)}`
  );
  console.log(`📦 Updated Portfolio for ${user}:`, users[user]);

  res.send({ success, user: users[user] });
});

// GET /leaderboard
app.get("/leaderboard", (req, res) => {
  console.log(`📥 [GET] /leaderboard`);
  const board = getLeaderboard();
  console.log(`🏆 Leaderboard Sent:`, board);
  res.send(board);
});

/**
 * GET /status/:user
 *
 * Purpose: Fetch a user's current trading status.
 *
 * Returns:
 * - The user's current USD balance.
 * - Current holdings (symbol => quantity).
 * - Current PnL (profit or loss compared to initial USD).
 * - Latest simulated asset prices.
 *
 * Notes:
 * - This recalculates PnL using the latest prices before responding.
 * - Returns 404 if user does not exist.
 *
 * Example: GET /status/rohit
 */
app.get("/status/:user", (req, res) => {
  const { user } = req.params;

  if (!users[user]) {
    // console.log(`[STATUS][${new Date().toISOString()}] User not found: ${user}`);
    console.log(
      `⚠️ [STATUS] User not found: ${user}`
    );
    return res.status(404).send({ error: "User not found, please check the username." });
  }

  const prices = getCurrentPrices();
  const pnl = calculatePNL(user, prices);

  console.log(
    `💹 [STATUS] User: ${user} | USD: ${
      users[user].usd
    } | PnL: ${pnl}`
  );

  res.send({
    name: user,
    usd: users[user].usd,
    holdings: users[user].holdings,
    pnl,
    prices,
  });
});

// Price update loop
setInterval(() => {
  updatePrices();
  const prices = getCurrentPrices();

  for (const user in users) {
    calculatePNL(user, prices);
  }

  const leaderboard = getLeaderboard();
  console.log(`🔄 Prices Updated:`, prices);
  io.emit("prices", { prices, leaderboard });
}, 500);

server.listen(3000, () => console.log("🚀 Server running on port 3000"));
