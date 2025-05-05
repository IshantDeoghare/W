const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
    const user = req.body;
    const data = fs.readFileSync(path.join(__dirname,'data.json'), 'utf8');
    const users = JSON.parse(data || '[]');
    users.push(user);
    fs.writeFileSync(path.join(__dirname,'data.json'), JSON.stringify(users), 'utf8');
    res.status(200).json({ message: 'User registered successfully' });
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const data = fs.readFileSync(path.join(__dirname,'data.json'), 'utf8');
    const users = JSON.parse(data || '[]');

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})