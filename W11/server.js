const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store
const users = [];

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, mobile, dob, city, address, username, password } = req.body;
  // basic duplicate check
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  users.push({ name, email, mobile, dob, city, address, username, password });
  res.status(201).json({ message: 'Registered successfully' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
