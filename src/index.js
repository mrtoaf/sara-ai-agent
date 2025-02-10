require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// Parse JSON bodies for API requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Import your API routes
const rugpullRoutes = require('./routes/rugpull'); // (for token JSON fetching)
const chatRoutes = require('./routes/chat');       // Chat route for AI conversation

// Use the API routes under /api
app.use('/api', rugpullRoutes);
app.use('/api', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});