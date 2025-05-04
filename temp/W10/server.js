const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// In-memory task store
let tasks = [];
let nextId = 1;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // serve index.html from /public

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  const task = { id: nextId++, text };
  tasks.push(task);
  res.status(201).json(task);
});

// Update an existing task
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task) return res.sendStatus(404);
  task.text = text;
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});