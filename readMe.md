# Project C2-Engine

A web-based application that simulates real-time cryptocurrency trading. Users can register, view live asset prices, perform trades, track performance, and compete on a live leaderboard — all in a fast, dynamic market environment.

---

## Overview

Each user starts with a virtual balance of **₹10,000 INR**. The platform simulates asset price volatility and allows users to:

- Buy/sell mock crypto assets
- Monitor price changes in real-time
- Track both realized and unrealized profits and losses
- View a ranked leaderboard
- Analyze price trends using live charts

---

## Features

### User Management
- Register using a unique `username`
- Optional fields: `name`, `wallet address`, `age`
- Each new user is initialized with ₹10,000

### Market Simulation
- Asset prices update every **500ms**
- Volatility introduced using randomized logic
- Supported mock assets:
  - `ETH_SUB1`
  - `ETH_SUB2`
  - `ETH_SUB3`

### Trading System
- Buy and sell assets using virtual INR
- Dynamic trade quantity based on live price
- Holdings maintain `quantity` and `cost basis`
- Profit and Loss (PnL):
  - **Realized PnL**: Based on completed trades
  - **Unrealized PnL**: Based on current asset value

### Leaderboard
- Displays all users sorted by total PnL
- Shows breakdown of:
  - Username
  - Total PnL
  - Realized and Unrealized PnL

### Live Price Charting
- Charts update in real-time via WebSocket
- Built using `recharts` and live market data
- One chart per asset showing price history

---

## Tech Stack

## Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | React, Tailwind CSS, Axios           |
| Backend      | Express.js, Socket.io                |
| Charting     | Recharts (for price history)         |
| Logging      | Separate Express log server          |
| Mock Assets  | Defined in `assets.js`               |
| State Mgmt   | React Hooks, React Context API       |


---

## Local Installation

- To run the **market server**, run:
```
cd server
npm install
npm run market
```
- To run the **frontend application**, run:
```
cd client
npm install
npm run app
```