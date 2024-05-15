require('./utils.js');

require('dotenv').config();
const express = require('express');
const app = express();
const Joi = require('joi');

// Login router
const loginRouter = require('./routes/login.js');
// signup router
const signUpRouter = require('./routes/signup.js');

// to create a session 
const session = require('express-session');
const MongoStore = require('connect-mongo');

const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); //to parse the body

// Mongo security information
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

var { database } = include('databaseConnection');

// connect the collection of users in the database
const userCollection = database.db(mongodb_database).collection('users');

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}`,
    crypto: {
        secret: mongodb_session_secret
    }
});

app.use(session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true
}));

// To do login
app.use('/login', loginRouter);
// verifies the if the user exists
app.use('/verifyUser', loginRouter);

// Link to the route sign up
app.use('/signup', signUpRouter);
app.use('/createUser', signUpRouter);


// Links to the main page
app.get('/', (req, res)=>{
    if(!req.session.authenticated){
        res.redirect('/login');
        return;
    }
    let form = "<form method='post' action='/logout'>"
            +  "<button>Logout</button>" 
            + "</form>";
    res.send('Hello '+ req.session.username + '!' + form);
});



// Logout 
app.post('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/login');
});

// Catches all 404
app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});