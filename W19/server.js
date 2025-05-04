// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// a) Connect to "student" DB
mongoose.connect('mongodb://localhost:27017/student', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// b) Define "studentmarks" collection schema
const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_Marks: Number
});
const Student = mongoose.model('studentmarks', studentSchema);

// c) Seed some students if empty
(async () => {
  if (await Student.countDocuments() === 0) {
    await Student.insertMany([
      { Name:'Alice', Roll_No:111, WAD_Marks:25, CC_Marks:30, DSBDA_Marks:22, CNS_Marks:18, AI_Marks:35 },
      { Name:'Bob',   Roll_No:112, WAD_Marks:45, CC_Marks:40, DSBDA_Marks:28, CNS_Marks:38, AI_Marks:42 },
      { Name:'Cara',  Roll_No:113, WAD_Marks:15, CC_Marks:20, DSBDA_Marks:18, CNS_Marks:25, AI_Marks:30 },
      { Name:'Dave',  Roll_No:114, WAD_Marks:55, CC_Marks:50, DSBDA_Marks:45, CNS_Marks:48, AI_Marks:52 },
      { Name:'Eve',   Roll_No:115, WAD_Marks:35, CC_Marks:32, DSBDA_Marks:26, CNS_Marks:28, AI_Marks:38 }
    ]);
    console.log('Seeded 5 students');
  }
})();

// d+e+g+h) GET /api/students with optional filters:
//   ?dsbda_gt=20
//   ?inc_gt=25         (all subjects >25)
//   ?low_wad_cns=true  (WAD<40 && CNS<40)
app.get('/api/students', async (req, res) => {
  const f = {};
  if (req.query.dsbda_gt)       f.DSBDA_Marks = { $gt: +req.query.dsbda_gt };
  if (req.query.inc_gt) {
    const n = +req.query.inc_gt;
    ['WAD_Marks','CC_Marks','DSBDA_Marks','CNS_Marks','AI_Marks']
      .forEach(k => f[k] = { $gt: n });
  }
  if (req.query.low_wad_cns === 'true') {
    f.WAD_Marks = { $lt: 40 };
    f.CNS_Marks = { $lt: 40 };
  }
  const students = await Student.find(f);
  res.json({ count: students.length, students });
});

// f) Increment all marks of a student by 10
app.patch('/api/students/:id/increment', async (req, res) => {
  const inc = {};
  ['WAD_Marks','CC_Marks','DSBDA_Marks','CNS_Marks','AI_Marks']
    .forEach(k => inc[k] = 10);
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    { $inc: inc },
    { new: true }
  );
  res.json(updated);
});

// i) Delete a student
app.delete('/api/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// j) Serve our front-end
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.listen(3000, () => console.log('👉 http://localhost:3000'));
