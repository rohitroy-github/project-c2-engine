// modelCaller.js
const { generatePercentageChanges } = require('../utils/sentimentEngine');
const fs = require('fs');
const path = require('path');

let io = null;
const lastPromptBySymbol = {};
const parentDir = path.join(__dirname, '..');
const PROMPT_FILE = path.join(parentDir,'assets', 'prompts.json');
const prompts = JSON.parse(fs.readFileSync(PROMPT_FILE, 'utf8'));

// configurable delay (seconds) before applying changes
const STRATEGY_DELAY_MS = 20000; // 7 seconds

function initializePromptEmitter(ioInstance) {
    io = ioInstance;
}

function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}

async function fetchPredictedPrices(symbol, history) {
    const promptObj = getRandomPrompt();
    const { sentiment, prompt } = promptObj;

    // only emit new prompts when changed
    if (prompt !== lastPromptBySymbol[symbol]) {
        lastPromptBySymbol[symbol] = prompt;
        if (io) {
            io.emit('promptUpdate', { symbol, sentiment, prompt });
            console.log(`[${symbol}] Emitted prompt: "${prompt}" with sentiment: "${sentiment}"`);
        }
    }

    // wait before applying changes so players can react
    return new Promise(resolve => {
        setTimeout(() => {
            const predicted = generatePercentageChanges(sentiment, history);
            console.log(`[${symbol}] Prompt: "${prompt}" => Predicted Changes: ${predicted.map(p => p.toFixed(2)).join(', ')}`);

            resolve({
                prompt,
                sentiment,
                predicted
            });
        }, STRATEGY_DELAY_MS);
    });
}

module.exports = { fetchPredictedPrices, initializePromptEmitter };
