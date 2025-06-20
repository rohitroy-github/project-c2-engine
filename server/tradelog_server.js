const express = require('express');
const app = express();

app.use(express.json());

const tradeLogs = [];  // You can replace this with a DB later

app.post('/log', (req, res) => {
  const trade = req.body;
  tradeLogs.push(trade);
  console.log('🎫 New trade logged: ', trade);
  res.send({ success: true });
});

app.get('/logs', (req, res) => {
  res.send(tradeLogs);
});

app.listen(4000, () => console.log('🚀 Tradelog server running on port 4000'));
