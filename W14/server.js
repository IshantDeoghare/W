// server.js - Simple Node.js server for user data
const express = require('express');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = 3000;

// Serve static files


// API endpoint to get all users
app.get('/api/users', (req, res) => {
  // Read the users.json file
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ error: 'Failed to read users data' });
    }
    
    // Send the JSON data
    res.json(JSON.parse(data));
  });
});

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});