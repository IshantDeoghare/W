// server.js - Node.js server for product catalog
const express = require('express');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('./'));

// API endpoint to get all products
app.get('/api/products', (req, res) => {
  // Read the products.json file
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading products file:', err);
      return res.status(500).json({ error: 'Failed to read products data' });
    }
    
    // Send the JSON data
    res.json(JSON.parse(data));
  });
});

// Simple server without extra endpoints

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});