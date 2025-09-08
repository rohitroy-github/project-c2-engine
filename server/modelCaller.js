// modelCaller.js
const { generatePercentageChanges } = require('./sentimentEngine');
const fs = require('fs');
const path = require('path');

let io = null;
const lastPromptBySymbol = {};
const PROMPT_FILE = path.join(__dirname, 'prompts.json');
const prompts = JSON.parse(fs.readFileSync(PROMPT_FILE, 'utf8'));

function initializePromptEmitter(ioInstance) {
    io = ioInstance;
}

function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}

async function fetchPredictedPrices(symbol, history) {
    const promptObj = getRandomPrompt();
    const { sentiment, prompt } = promptObj;

    if (prompt !== lastPromptBySymbol[symbol]) {
        lastPromptBySymbol[symbol] = prompt;
        if (io) {
            io.emit('promptUpdate', { symbol, sentiment, prompt });
        }
    }

    // generate % changes using algorithm
    const predicted = generatePercentageChanges(sentiment, history);
    console.log(`[${symbol}] Prompt: "${prompt}" => Predicted Changes: ${predicted.map(p => p.toFixed(2)).join(', ')}`);
    

    return {
        prompt,
        sentiment,
        predicted
    };
}

module.exports = { fetchPredictedPrices, initializePromptEmitter };
