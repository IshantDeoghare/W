// First, install necessary packages with:
// npm init -y
// npm install express mongoose cors

// app.js - Main application file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/music')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Song Schema
const songSchema = new mongoose.Schema({
  Songname: String,
  Film: String,
  Music_director: String,
  singer: String,
  Actor: String,
  Actress: String
});

// Create Song model
const Song = mongoose.model('song_detail', songSchema);

// Routes

// a) Create database called music - Done through mongoose.connect above

// b) Create collection called song_details - Done through model creation

// c) Insert array of 5 song documents
app.get('/insert-songs', async (req, res) => {
  try {
    await Song.deleteMany({}); // Clear collection first
    
    const songs = [
      { Songname: "Tum Hi Ho", Film: "Aashiqui 2", Music_director: "Mithoon", singer: "Arijit Singh" },
      { Songname: "Senorita", Film: "Zindagi Na Milegi Dobara", Music_director: "Shankar-Ehsaan-Loy", singer: "Farhan Akhtar" },
      { Songname: "Channa Mereya", Film: "Ae Dil Hai Mushkil", Music_director: "Pritam", singer: "Arijit Singh" },
      { Songname: "Kal Ho Naa Ho", Film: "Kal Ho Naa Ho", Music_director: "Shankar-Ehsaan-Loy", singer: "Sonu Nigam" },
      { Songname: "Chaiyya Chaiyya", Film: "Dil Se", Music_director: "A.R. Rahman", singer: "Sukhwinder Singh" }
    ];
    
    const result = await Song.insertMany(songs);
    res.send(`Inserted ${result.length} songs successfully`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// d) Display total count and list all documents
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json({
      count: songs.length,
      songs: songs
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// e) List songs by specified Music Director
app.get('/songs/director/:director', async (req, res) => {
  try {
    const songs = await Song.find({ Music_director: req.params.director });
    res.json(songs);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// f) List specified Music Director songs sung by specified Singer
app.get('/songs/director/:director/singer/:singer', async (req, res) => {
  try {
    const songs = await Song.find({ 
      Music_director: req.params.director,
      singer: req.params.singer
    });
    res.json(songs);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// g) Delete a song
app.delete('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).send('Song not found');
    res.send('Song deleted successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// h) Add new favorite song
app.post('/songs', async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).send('Song added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// i) List songs by specified Singer from specified film
app.get('/songs/film/:film/singer/:singer', async (req, res) => {
  try {
    const songs = await Song.find({ 
      Film: req.params.film,
      singer: req.params.singer
    });
    res.json(songs);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// j) Update document by adding Actor and Actress name
app.put('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { Actor: req.body.Actor, Actress: req.body.Actress },
      { new: true }
    );
    if (!song) return res.status(404).send('Song not found');
    res.json(song);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});