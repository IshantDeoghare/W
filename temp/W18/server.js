const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/musix",{ useUnifiedTopology: true })
.then(console.log("Connected to MongoDB"))

const musicSceama = mongoose.Schema({
   SongName : String,
   Film : String,
   Music_Director : String,
   Singer : String,
   Actor : String,
   Actress : String
})

const musix = mongoose.model("musix",musicSceama);

app.get('/seed',async(req,res)=>{
  const songs = [
    { SongName: 'Song A', Film: 'Film X', Music_Director: 'Director 1', Singer: 'Singer A' },
    { SongName: 'Song B', Film: 'Film Y', Music_Director: 'Director 2', Singer: 'Singer B' },
    { SongName: 'Song C', Film: 'Film X', Music_Director: 'Director 1', Singer: 'Singer C' },
    { SongName: 'Song D', Film: 'Film Z', Music_Director: 'Director 3', Singer: 'Singer A' },
    { SongName: 'Song E', Film: 'Film Y', Music_Director: 'Director 2', Singer: 'Singer D' },
  ]

  try{
    const result = await musix.insertMany(songs);
    res.send(`Inserted ${result.length} songs`);
  }
  catch(err){
    res.status(500).send(err.toString());
  }
})

app.get('/songs',async (req,res) => {
  try {
    const count = await musix.countDocuments();
    const songs = await musix.find();
    res.json({count,songs});
  }catch(err){
    res.status(500).send(err.toString());
  }
})

app.get('/songs/director/:director',async (req,res) => {
  const {director} = req.params;

  try{
    const songs = await musix.find({Music_Director : director});
    res.json(songs);
  }catch(err) {
    res.status(500).send(err.toString());
  }
})

app.get('/director/:director/singer/:singer',async (req,res) => {
  const {director,singer} = req.params;

  try{
    const songs = await musix.find({Music_Director:director,Singer:singer});
    res.json(songs);
  }catch(err){
    res.status(500).send(err.toString());
  }
})

app.delete('/songs/:songname',async (req,res) =>{
  const {songname} = req.params;

  try{
    const result = await musix.deleteOne({SongName:songname});
    if(result.deletedCount === 0) return res.status(404).send('Song Not found');
    res.send(`Deleted song:  ${songname}`);
  }
  catch(err){
    res.status(500).send(err.toString());
  }
})

app.post('/songs',async (req,res) => {
  const song = req.body;
  try{
    const result = await musix.create(song);
    res.json(song);
  }catch (err) {
    res.status(500).send(err.toString());
  }
})

app.get('/songs/film/:film/singer/:singer', async (req, res) => {
  const { film, singer } = req.params;
  try {
    const songs = await musix.find({ Film: film, Singer: singer });
    res.json(songs);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.put('/songs/:songname',async (req,res) => {
  const {songname} = req.params;
  const {Actor,Actress} = req.body;

  try{
    const result = await musix.updateOne(
      {SongName:songname},
      {$set: {Actor,Actress}}
    );
    res.json(result);
  }
  catch (err) {
    res.status(500).send(err.toString());
  }
})

const PORT = 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));