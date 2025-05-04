// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1️⃣ Connect to local MongoDB (db: bookstoreDB)
mongoose.connect('mongodb://localhost:27017/bookstoreDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'));

// 2️⃣ Define Book schema & model
const bookSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  author:  { type: String, required: true },
  price:   { type: Number, required: true },
  genre:   { type: String, required: true },
});
const Book = mongoose.model('Book', bookSchema);

// 3️⃣ CRUD Endpoints

// ➕ Add new book
// POST /api/books
app.post('/api/books', async (req, res) => {
  try {
    const b = new Book(req.body);
    await b.save();
    res.status(201).json(b);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 📋 Retrieve all books
// GET /api/books
app.get('/api/books', async (req, res) => {
  const list = await Book.find().sort('title');
  res.json(list);
});

// 🔄 Update a book
// PUT /api/books/:id
app.put('/api/books/:id', async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 🗑️ Delete a book
// DELETE /api/books/:id
app.delete('/api/books/:id', async (req, res) => {
  const deleted = await Book.findByIdAndDelete(req.params.id);
  if (!deleted) return res.sendStatus(404);
  res.sendStatus(204);
});

// 4️⃣ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
