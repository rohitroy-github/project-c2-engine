# 💸 Simulated Crypto Trading Game – "Stock Clash"

A real-time, gamified **crypto trading simulation platform** where players can:

- Trade mock crypto assets like ETH_SUB1, ETH_SUB2, and ETH_SUB3
- Compete in short-burst market simulations
- View live price charts and personal portfolios
- Climb up a leaderboard based on profit/loss
- Experience high-speed simulated markets with real-time price changes

---

## 🚀 Project Overview

This project is a **web-based crypto trading simulator**, where each user starts with $10,000 fake USD. Users can:

- **Buy/Sell** assets in a simulated market
- Track **realized** and **unrealized PnL**
- Compete on a **live leaderboard**
- View **live-updating price charts**
- Watch prices fluctuate in real-time (via pseudo-volatility)

---

## 🧩 Key Features

### 🧑 User System
- Create user with `username` (name, age, wallet address optional)
- Store balance, holdings, PnL (profit and loss)

### 💹 Market Simulator
- Prices of assets update every 500ms
- Randomized volatility simulation per asset
- Assets tracked: `ETH_SUB1`, `ETH_SUB2`, `ETH_SUB3`

### 🔄 Trading System
- Buy/sell assets with USD
- Dynamic quantity based on current price
- Cost basis maintained per asset
- PnL calculated with:
  - Realized PnL (after selling)
  - Unrealized PnL (current value - cost basis)

### 📊 Leaderboard
- Sorted by total PnL (realized + unrealized)
- Displays top performers and their holdings

### 📈 Live Charting
- Each asset shows a real-time line chart of price movements
- Built using socket-powered updates + charting library

---

## 🧱 Tech Stack

| Layer       | Tech                                     |
|------------|-------------------------------------------|
| Frontend    | React, Tailwind CSS, Recharts, Axios      |
| Backend     | Express.js, Socket.io                     |
| State Mgmt  | React Hooks, Custom Props                 |
| Charting    | `recharts` (line charts)                  |
| Logging     | Dedicated Express server for trade logs   |
| Mock Assets | `assets.js` file with predefined assets   |

---

## 📂 Folder Structure
# 💸 Simulated Crypto Trading Game – "Stock Clash"

A real-time, gamified **crypto trading simulation platform** where players can:

- Trade mock crypto assets like ETH_SUB1, ETH_SUB2, and ETH_SUB3
- Compete in short-burst market simulations
- View live price charts and personal portfolios
- Climb up a leaderboard based on profit/loss
- Experience high-speed simulated markets with real-time price changes

---

## 🚀 Project Overview

This project is a **web-based crypto trading simulator**, where each user starts with $10,000 fake USD. Users can:

- **Buy/Sell** assets in a simulated market
- Track **realized** and **unrealized PnL**
- Compete on a **live leaderboard**
- View **live-updating price charts**
- Watch prices fluctuate in real-time (via pseudo-volatility)

---

## 🧩 Key Features

### 🧑 User System
- Create user with `username` (name, age, wallet address optional)
- Store balance, holdings, PnL (profit and loss)

### 💹 Market Simulator
- Prices of assets update every 500ms
- Randomized volatility simulation per asset
- Assets tracked: `ETH_SUB1`, `ETH_SUB2`, `ETH_SUB3`

### 🔄 Trading System
- Buy/sell assets with USD
- Dynamic quantity based on current price
- Cost basis maintained per asset
- PnL calculated with:
  - Realized PnL (after selling)
  - Unrealized PnL (current value - cost basis)

### 📊 Leaderboard
- Sorted by total PnL (realized + unrealized)
- Displays top performers and their holdings

### 📈 Live Charting
- Each asset shows a real-time line chart of price movements
- Built using socket-powered updates + charting library

---

## 🧱 Tech Stack

| Layer       | Tech                                     |
|------------|-------------------------------------------|
| Frontend    | React, Tailwind CSS, Recharts, Axios      |
| Backend     | Express.js, Socket.io                     |
| State Mgmt  | React Hooks, Custom Props                 |
| Charting    | `recharts` (line charts)                  |
| Logging     | Dedicated Express server for trade logs   |
| Mock Assets | `assets.js` file with predefined assets   |

---

