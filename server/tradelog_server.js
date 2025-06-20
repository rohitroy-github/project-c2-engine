const express = require('express');
const app = express();

app.use(express.json());

const tradeLogs = [];
let tradeCounter = 1;

app.post('/log', (req, res) => {
  const trade = req.body;

  const tradeWithId = {
    id: tradeCounter++, 
    ...trade,
  };

  tradeLogs.push(tradeWithId);
  console.log('🎫 New trade logged: ', tradeWithId);

  res.send({ success: true, id: tradeWithId.id });
});

app.get('/logs', (req, res) => {
  res.send(tradeLogs);
});

app.listen(4000, () => console.log('🚀 Tradelog server running on port 4000'));
