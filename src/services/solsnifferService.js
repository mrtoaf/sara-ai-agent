const axios = require('axios');
// Load environment variables from .env
require('dotenv').config();

// Read the API key from the environment variable
const API_KEY = process.env.SOLSNIPPER_API_KEY;

// Base URL for v2 of the Solsniffer API
const BASE_URL = 'https://solsniffer.com/api/v2';

async function checkToken(tokenAddress) {
  try {
    const url = `${BASE_URL}/token/${tokenAddress}`;
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Solsniffer API error (${error.response.status}): ${error.response.data.message || error.response.statusText}`
      );
    }
    throw new Error(`Error calling Solsniffer API: ${error.message}`);
  }
}

async function refreshToken(tokenAddress) {
  try {
    const url = `${BASE_URL}/token/refresh/${tokenAddress}`;
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Solsniffer API error (${error.response.status}): ${error.response.data.message || error.response.statusText}`
      );
    }
    throw new Error(`Error calling Solsniffer API: ${error.message}`);
  }
}

module.exports = {
  checkToken,
  refreshToken,
};