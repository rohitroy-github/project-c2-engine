// modelCaller.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PROMPT_FILE = path.join(__dirname, 'prompts.json');

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

async function fetchPredictedPrices(symbol, history) {
    const prompt = (typeof crypto !== 'undefined' && crypto.getRandomValues)
        ? getRandomPrompt()
        : fallbackPrompt();

    try {
        // const response = await axios.post('http://127.0.0.1:8000/predict', {
        //     symbol,
        //     history,
        //     prompt
        // });

        return {
            prompt,
            //   predicted: response.data.predicted_price
            predicted: [
                127.6,
                116.2,
                102.2,
                84.4,
                56.8
            ]

        };
    } catch (err) {
        console.error(`[modelCaller] Error fetching from model:`, err.message);
        return null;
    }
}

module.exports = { fetchPredictedPrices };
