const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.static('./'));

app.get("/api/users",(req,res) =>{
  fs.readFile('users.json','utf-8',(err,data) => {
    if(err){
      return res.status(500);
    }
     res.json(JSON.parse(data));
  })
})

app.get("/",(req,res)=>{
  res.sendFile(__dirname + '/index.html');
})

const PORT = 3000;

app.listen(PORT,()=>{console.log(`running on http://localhost:${PORT}`)});