// tests/rugpull.test.js
const request = require('supertest');
const express = require('express');
const rugpullRoutes = require('../src/routes/rugpull');

// Create an Express app for testing.
const app = express();
app.use(express.json());
app.use('/api', rugpullRoutes);

// Mock the solsnifferService to avoid real API calls.
jest.mock('../src/services/solsnifferService', () => ({
  checkToken: jest.fn(async (tokenAddress) => {
    // Return dummy token details similar to what the API might return.
    return {
      tokenData: {
        indicatorData: {
          high: {
            count: 5,
            details: '{"Freeze risks found":true,"Tokens auto-freeze risks found":true}'
          },
          moderate: {
            count: 1,
            details: '{"Token operates without custom fees":true}'
          },
          low: {
            count: 0,
            details: '{"Contract was not recently deployed":true}'
          },
          specific: {
            count: 0,
            details: '{"Recent interaction within the last 30 days":true}'
          },
        },
        tokenOverview: {
          deployer: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
          mint: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
          address: tokenAddress,
          type: 'spl-token'
        },
        tokenName: 'Wrapped Ethereum (Sollet)',
        tokenSymbol: 'ETH',
        tokenImg: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk/logo.png',
        address: tokenAddress,
        score: 65,
        deployTime: '2023-01-01T00:00:00Z',
        marketCap: 247268964.57,
        externals: '{"website":"https://www.ethereum.org"}',
        liquidityList: [],
        ownersList: [],
        auditRisk: {
          mintDisabled: false,
          freezeDisabled: true,
          lpBurned: false,
          top10Holders: false
        }
      },
      tokenInfo: {
        price: 1.23,
        supplyAmount: 1000000,
        mktCap: 1230000
      }
    };
  }),
}));

describe('GET /api/check-rugpull/:tokenAddress', () => {
  it('should return token details for a valid token address', async () => {
    const tokenAddress = 'dummyTokenAddress123';
    const res = await request(app).get(`/api/check-rugpull/${tokenAddress}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tokenAddress', tokenAddress);
    expect(res.body).toHaveProperty('tokenData');
    expect(res.body).toHaveProperty('tokenInfo');
  });

  it('should return a 500 error when the service throws an error', async () => {
    // Override the mock to simulate an error.
    const { checkToken } = require('../src/services/solsnifferService');
    checkToken.mockImplementationOnce(() => {
      throw new Error('Simulated API error');
    });

    const res = await request(app).get(`/api/check-rugpull/faultyToken`);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Simulated API error');
  });
});