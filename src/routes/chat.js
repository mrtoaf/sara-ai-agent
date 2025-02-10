const express = require('express');
const router = express.Router();
const solsnifferService = require('../services/solsnifferService');
const openaiService = require('../services/openaiService'); 

/**
 * POST /api/chat
 *
 * Expects:
 *   - tokenAddress: The contract address.
 *   - messages (optional): Array of conversation messages.
 */
router.post('/chat', async (req, res) => {
  try {
    const { tokenAddress, messages } = req.body;
    if (!tokenAddress) {
      return res.status(400).json({ error: 'tokenAddress is required' });
    }
    
    // Fetch token data from Solsniffer
    const tokenDetails = await solsnifferService.checkToken(tokenAddress);

    // Add initial system context if no previous messages exist
    let conversation = messages;
    if (!conversation || conversation.length === 0) {
      conversation = [
        {
          role: "system",
          content: `Here is the latest Solsniffer token analysis for ${tokenAddress}:\n\n${JSON.stringify(tokenDetails, null, 2)} Please provide all the metrics in an easy to read format, and then provide 1-2 paragraphs analyzing all the metrics`
        }
      ];
    }
    
    // Call OpenRouter with memory and token analysis
    const result = await openaiService.chatCompletion(conversation);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;