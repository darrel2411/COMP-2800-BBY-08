require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const expireTime = 60 * 60 * 1000;// Hour, minutes, seconds miliseconds

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); //to parse the body

// Links to the main page
app.get('/', (req, res)=>{
    res.send('Hello world!')
});

// links to the login page
app.get('/login', (req, res)=>{
    res.render("login");
});

// links to sign in page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Catches all 404
app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});