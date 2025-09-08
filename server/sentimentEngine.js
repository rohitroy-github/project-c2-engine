// sentimentEngine.js
function getSentimentEffect(sentiment) {
  switch (sentiment) {
    case "Bullish":
      return { drift: 0.002, volatility: 0.01 };
    case "Bearish":
      return { drift: -0.002, volatility: 0.01 };
    case "Neutral":
      return { drift: 0.0, volatility: 0.005 };
    case "News/Event":
      return { drift: (Math.random() - 0.5) * 0.006, volatility: 0.02 };
    case "Rumors":
      return { drift: (Math.random() - 0.5) * 0.005, volatility: 0.015 };
    case "Technical":
      return { drift: (Math.random() - 0.5) * 0.004, volatility: 0.01 };
    case "FOMO/Panic":
      return { drift: (Math.random() - 0.5) * 0.02, volatility: 0.03 };
    default:
      return { drift: 0.0, volatility: 0.01 };
  }
}

// Generate percentage changes based on sentiment
function generatePercentageChanges(sentiment, history, n = 3) {
  const { drift, volatility } = getSentimentEffect(sentiment);
  const changes = [];

  for (let i = 0; i < n; i++) {
    const shock = (Math.random() * 2 - 1) * volatility;
    const change = drift + shock;
    changes.push(parseFloat((change * 100).toFixed(2))); // convert to %
  }

  return changes;
}

module.exports = { generatePercentageChanges };
