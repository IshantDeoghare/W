const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/book_library",
    {
        useNewUrlParser : true,
        useUnifiedTopology: true
    }
)
.then(()=> console.log("Mongodb Connected Successfully"))

const BookSchema = new mongoose.Schema({
    Title : {type : String, required : true},
    Author : {type : String, required : true},
    Price : {type :Number,required : true},
    genre : {type : String , required : true}
})

const Book = mongoose.model("Books",BookSchema);


app.post("/api/Books",async (req,res)=>{
    try{
        const bk = new Book(req.body);
        await bk.save();
        res.status(201).json(bk);

    }
    catch(e){
        res.status(404).json({error : e.message});
    }
})

app.get("/api/Books",async (req,res)=>{
    const books = await Book.find().sort('title');
    res.json(books);
})

app.put("/api/Books/:id",async (req,res) =>{
    try{
        const book = await Book.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators : true});
        if(!book) res.sendStatus(404);
        res.json(book);
    }
    catch(e){
        res.status(404).json({error : e.message});
    }
})

app.delete("/api/Books/:id",async (req,res) =>{
    try{
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book) res.sendStatus(404);
        res.sendStatus(204);
    }
    catch(e){
        res.status(404).json({error : e.message});
    }
})

const PORT = 3000

app.listen(PORT,()=>{console.log(`running on http://localhost:${PORT}`)});