const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file (only for development)
require('dotenv').config();

// Read the API key from the environment variable
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// OpenRouter Chat Completions endpoint
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Load memory file
const memoryFilePath = path.join(__dirname, '../data/memory.txt');
let agentMemory = '';

// Load memory at server startup
try {
  agentMemory = fs.readFileSync(memoryFilePath, 'utf-8');
  console.log('Agent memory loaded successfully.');
} catch (err) {
  console.error('Error loading agent memory:', err);
}

/**
 * Calls the OpenRouter Chat completions endpoint with a list of messages.
 * @param {Array} messages - An array of message objects (each with role and content).
 * @returns {Promise<Object>} - The API response from OpenRouter.
 */
async function chatCompletion(messages) {
  try {
    // Insert memory into the system message if it's not already included
    const hasSystemMessage = messages.some(msg => msg.role === "system");
    if (!hasSystemMessage) {
      messages.unshift({
        role: "system",
        content: agentMemory, // Inject memory into system message
      });
    }
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'anthropic/claude-3.5-sonnet', // Use the appropriate model
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://your_site_url', // Optional for OpenRouter rankings
          'X-Title': 'Your Site Name'             // Optional for OpenRouter rankings
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `OpenRouter API error (${error.response.status}): ${error.response.data.error.message || error.response.statusText}`
      );
    }
    throw new Error(`Error calling OpenRouter API: ${error.message}`);
  }
}

module.exports = { chatCompletion };