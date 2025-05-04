const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read/write JSON file
 function readTodos() {
  const json = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(json);
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE,
    JSON.stringify(todos, null, 2), 'utf-8');
}

app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todos = readTodos();
  const { text } = req.body;
  const newTodo = { id: Date.now().toString(), text, completed: false };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT update todo (text or completed)
app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.sendStatus(404);
  Object.assign(todo, req.body);
  writeTodos(todos);
  res.json(todo);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  let todos = readTodos();
  todos = todos.filter(t => t.id !== req.params.id);
  writeTodos(todos);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));