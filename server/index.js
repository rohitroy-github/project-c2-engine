// main server file

const express = require('express');
const cors = require('cors');
const http = require('http');

const {Server} = require('socket.io'); 

const { updatePrices, getCurrentPrices } = require('./priceEngine'); 
const {users, createUser, trade, calculatePNL} = require("./users"); 
const { getLeaderboard } = require('./leaderboard');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}}); 

app.use(cors());
app.use(express.json()); 

app.post('/user', (req, res) => { 
    const {name} = req.body;

    if(!users[user]) { 

        createUser(name); 
    }

  res.send({ msg: "User created", balance: users[name] });
})

app.post('/trade', (req, res) => {
  const { user, symbol, side, amountUSD } = req.body;
  const prices = getCurrentPrices();
  const success = trade(user, symbol, side, amountUSD, prices[symbol]);
  calculatePnL(user, prices);
  res.send({ success, user: users[user] });
});

app.get('/leaderboard', (req, res) => {
  res.send(getLeaderboard());
});

// Socket price updates
setInterval(() => {
  updatePrices();
  const prices = getCurrentPrices();
  for (const user in users) calculatePnL(user, prices);
  io.emit('prices', { prices, leaderboard: getLeaderboard() });
}, 2000);

server.listen(3000, () => console.log('Server running on port 3000'));
