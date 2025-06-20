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
 * Example:
 * POST /trade { username: "rohit", symbol: "FAKEBTC", side: "BUY", amountUSD: 5000 }
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
    return res.status(404).send({ error: "User not found, please check the username." });
  }

  console.log(
    `👉 [POST] /trade | User: ${username} | Symbol: ${symbol} | Side: ${side} | Amount: $${amountUSD}`
  );

  const prices = getCurrentPrices();

  // Validate symbol
  if (!prices[symbol]) {
    console.log(`⚠️ Invalid symbol '${symbol}'`);
    return res.status(400).send({ error: `Invalid trading symbol '${symbol}'.` });
  }

  // Attempt trade
  const result = trade(username, symbol, side, amountUSD, prices[symbol]);

  if (result.success) {
    calculatePNL(username, prices);
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
 * Purpose: Fetch the current trading leaderboard, sorted by PnL.
 *
 * Returns:
 * - An array of users with their names and current PnL, sorted in descending order.
 *
 * Notes:
 * - The leaderboard is recalculated before sending.
 * - No authentication is applied — it shows all active users' PnL.
 *
 * Example: GET /leaderboard
 */
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
