// src/routes/rugpull.js
const express = require('express');
const router = express.Router();
const solsnifferService = require('../services/solsnifferService');

/**
 * GET /api/check-rugpull/:tokenAddress
 * This endpoint calls the Solsniffer API to retrieve token details.
 */
router.get('/check-rugpull/:tokenAddress', async (req, res) => {
  const { tokenAddress } = req.params;
  try {
    const tokenDetails = await solsnifferService.checkToken(tokenAddress);
    // You can add further processing here if you want to analyze the indicatorData
    res.json({
      tokenAddress,
      tokenData: tokenDetails.tokenData,
      tokenInfo: tokenDetails.tokenInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;