// modelCaller.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PROMPT_FILE = path.join(__dirname, 'prompts.json');

// Simulated model response delay in milliseconds (e.g., 2–5 seconds)
// const MIN_DELAY_MS = 2000;
// const MAX_DELAY_MS = 5000;

// function simulateDelay(min = MIN_DELAY_MS, max = MAX_DELAY_MS) {
//     const duration = Math.floor(Math.random() * (max - min + 1)) + min;
//     return new Promise(resolve => setTimeout(resolve, duration));
// }


let io = null;
const lastPromptBySymbol = {};

function initializePromptEmitter(ioInstance) {
    io = ioInstance;
}

// Load prompts once
const prompts = JSON.parse(fs.readFileSync(PROMPT_FILE, 'utf8'));

// Get a strong unpredictable random prompt
function getRandomPrompt() {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % prompts.length;
    return prompts[randomIndex];
}

// Fallback for older Node.js versions if crypto.getRandomValues isn't available
function fallbackPrompt() {
    const index = Math.floor(Math.random() * prompts.length);
    return prompts[index];
}

const presentPrompt = null;

async function fetchPredictedPrices(symbol, history) {
    const prompt = (typeof crypto !== 'undefined' && crypto.getRandomValues)
        ? getRandomPrompt()
        : fallbackPrompt();
    // presentPrompt = prompt;

    if (prompt !== lastPromptBySymbol[symbol]) {
        lastPromptBySymbol[symbol] = prompt;
        if (io) {
            io.emit('promptUpdate', { symbol, prompt });
        }
    }
    try {
        const response = await axios.post('http://127.0.0.1:8000/predict', {
            symbol,
            history,
            prompt
        });

        return {
            prompt,
            predicted: response.data.predicted_price

        };
    } catch (err) {
        console.error(`[modelCaller] Error fetching from model:`, err.message);
        return null;
    }
}

module.exports = { fetchPredictedPrices, initializePromptEmitter };

// Mock model prediction function with simulated delay
// async function fetchPredictedPrices(symbol, history) {
//     const prompt = getRandomPrompt();

//     console.log(`[modelCaller] Simulating model delay for ${symbol}...`);

//     await simulateDelay();

//     console.log(`[modelCaller] Model response ready for ${symbol}`);

//     return {
//         prompt,
//         predicted: [
//             127.6,
//             116.2,
//             102.2,
//             84.4,
//             56.8
//         ]
//     };
// }

// module.exports = { fetchPredictedPrices };