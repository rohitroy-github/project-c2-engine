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
  const { username } = req.body;
  console.log(`👉 [POST] /user | Payload:`, req.body);

  if (!users[username]) {
    createUser(username);
    console.log(`✅ User '${username}' created.`);
  } else {
    console.log(`⚠️ User '${username}' already exists.`);
    return res
      .status(404)
      .send({ error: "User already exists, please use a different username." });
  }

  res.send({ msg: "User created", balance: users[username] });
});

// POST /trade
app.post("/trade", (req, res) => {
  const { username, symbol, side, amountUSD } = req.body;

  // check for user availibility
  if (!users[username]) {
    console.log(`⚠️ User '${username}' not found.`);
    return res
      .status(404)
      .send({ error: "User not found, please check the username." });
  } else {
    console.log(
      `👉 [POST] /trade | User: ${username} | Symbol: ${symbol} | Side: ${side} | Amount: $${amountUSD}`
    );
  }

  const prices = getCurrentPrices();
  const currentPrice = prices[symbol];
  console.log(`📊 Current Price of ${symbol}: $${currentPrice}`);

  const success = trade(username, symbol, side, amountUSD, currentPrice);
  const pnl = calculatePNL(username, prices);

  console.log(
    `💹 Trade ${success ? "executed" : "failed"} | PNL: $${pnl.toFixed(2)}`
  );
  console.log(`📦 Updated Portfolio for ${username}:`, users[username]);

  res.send({ success, username: users[username] });
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
    console.log(`⚠️ [STATUS] User not found: ${user}`);
    return res
      .status(404)
      .send({ error: "User not found, please check the username." });
  }

  const prices = getCurrentPrices();
  const pnl = calculatePNL(user, prices);

  console.log(
    `💹 [STATUS] User: ${user} | USD: ${users[user].usd} | PnL: ${pnl}`
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
