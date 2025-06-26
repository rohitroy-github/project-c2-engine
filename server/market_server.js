const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const axios = require('axios');

const { updatePrices, getCurrentPrices } = require("./priceEngine");
const { users, createUser, trade, calculatePNL } = require("./users");
const { getLeaderboard } = require("./leaderboard");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

function logTradeToLoggerServer(tradeData) {
  axios
    .post("http://localhost:4000/log", tradeData)
    .then(() => console.log("✅ Trade logged successfully."))
    .catch((err) => console.error("Error in log server: ", err.message));
}

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

/**
 * POST /trade
 * -----------------------------
 * Handles buy or sell trade requests for a user.
 *
 * Request body:
 * {
 *   username: string,      // The user's unique identifier
 *   symbol: string,        // The asset symbol (e.g., FAKEBTC)
 *   side: "BUY" | "SELL",  // Trade type
 *   amountUSD: number      // USD value to trade
 * }
 *
 * Workflow:
 * 1️⃣ Validate that the user exists.
 * 2️⃣ Validate that the asset symbol is correct.
 * 3️⃣ Attempt the trade via `trade()` helper:
 *    - Check for sufficient funds or holdings
 *    - Update user balances if successful
 * 4️⃣ If trade succeeds, update the user's PnL (profit and loss).
 * 5️⃣ Return the result with updated user state and price info.
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string,       // Success/failure reason
 *   user: object,          // Updated user portfolio
 *   price: number          // Asset price at trade time
 * }
 *
 * Notes:
 * - Logs key trade info for server-side debugging.
 * - Returns clear error messages for invalid users, symbols, or insufficient balance/holdings.
 */
app.post("/trade", (req, res) => {
  const { username, symbol, side, amountUSD } = req.body;

  // Check for user availability
  if (!users[username]) {
    console.log(`⚠️ User '${username}' not found.`);
    return res
      .status(404)
      .send({ error: "User not found, please check the username." });
  }

  console.log(
    `👉 [POST] /trade | User: ${username} | Symbol: ${symbol} | Side: ${side} | Amount: $${amountUSD}`
  );

  const prices = getCurrentPrices();

  // Validate symbol
  if (!prices[symbol]) {
    console.log(`⚠️ Invalid symbol '${symbol}'`);
    return res
      .status(400)
      .send({ error: `Invalid trading symbol '${symbol}'.` });
  }

  // Attempt trade
  const result = trade(username, symbol, side, amountUSD, prices[symbol]);

  if (result.success) {
    calculatePNL(username, prices);

    // logging in the trade

    logTradeToLoggerServer({
      username,
      symbol,
      side,
      amountUSD,
      price: prices[symbol],
      timestamp: Date.now(),
    });
  }

  res.send({
    ...result,
    user: users[username],
    price: prices[symbol],
  });
});

/**
 * GET /leaderboard
 *
 * Purpose: Fetch the current trading leaderboard, sorted by PnL (Profit and Loss).
 *
 * Returns:
 * - If users exist: An object containing a success message and an array of users,
 *   where each user includes:
 *     - name (string)
 *     - pnl (number, current profit/loss)
 *     - holdings (array of { symbol, quantity }, only non-zero holdings, quantity rounded to 4 decimal places)
 *
 * - If no users exist: An object with a message and an empty leaderboard array.
 *
 * Notes:
 * - The leaderboard is recalculated before sending based on the latest state.
 * - No authentication is applied — it shows all active users' PnL.
 */
app.get("/leaderboard", (req, res) => {
  console.log(`📥 [GET] /leaderboard`);
  const board = getLeaderboard();
  console.log(`🏆 Leaderboard fetched:`, board.leaderboard);
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
    realizedPNL: users[user].realizedPNL,
    unrealizedPNL: users[user].unrealizedPNL,
    // prices,
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

server.listen(3000, () => console.log("🚀 Market server running on port 3000"));
