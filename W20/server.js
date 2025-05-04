// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());  // parse JSON bodies
app.use(cors());          // allow cross-origin if needed

// 1️⃣ Connect to local MongoDB (db: employeeDB)
mongoose.connect('mongodb://localhost:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'));

// 2️⃣ Define Employee schema & model
const employeeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  department:  { type: String, required: true },
  designation: { type: String, required: true },
  salary:      { type: Number, required: true },
  joiningDate: { type: Date,   required: true },
});
const Employee = mongoose.model('Employee', employeeSchema);

// 3️⃣ CRUD Endpoints

// ➕ Add new employee
// POST /api/employees
app.post('/api/employees', async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).json(emp);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 📋 View all employees
// GET /api/employees
app.get('/api/employees', async (req, res) => {
  const list = await Employee.find().sort('name');
  res.json(list);
});

// 🔄 Update existing employee
// PUT /api/employees/:id
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
 z }
});

// 🗑️ Delete an employee
// DELETE /api/employees/:id
app.delete('/api/employees/:id', async (req, res) => {
  const del = await Employee.findByIdAndDelete(req.params.id);
  if (!del) return res.sendStatus(404);
  res.sendStatus(204);
});

// 4️⃣ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 running on http://localhost:${PORT}`));
