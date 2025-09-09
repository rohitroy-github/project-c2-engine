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
  console.log(`history: ${history}`);
  // History bias: last vs avg(last 5)
  let bias = 0;
  if (history && history.length >= 2) {
    const recent = history.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const last = recent[recent.length - 1];
    bias = ((last - avg) / Math.max(avg, 1e-9)) * 0.4; // gentle nudge
  }
  const { drift, volatility } = getSentimentEffect(sentiment);
  const changes = [];

  for (let i = 0; i < n; i++) {
    const shock = (Math.random() * 2 - 1) * volatility;
    const change = drift + bias + shock;
    changes.push(parseFloat((change * 100).toFixed(2))); // convert to %
    // decay bias slightly so it doesn’t lock direction
    bias *= 0.6 + Math.random() * 0.2;
  }

  return changes;
}

module.exports = { generatePercentageChanges };
