require('dotenv');
const express = require('express');
const router = express.Router();

const navLinks = [
    {name: 'Home', link: '/'},
    {name: 'Recycle Centers', link: '/'},
    {name: 'Scan', link: '/'},
    {name: 'Tutorial', link: '/tutorial'},
    {name: 'Profile', link: '/profile'}
];

const mongodb_database = process.env.MONGODB_DATABASE;

var { database } = include('databaseConnection');

//connect the collection of users in the database
const userCollection = database.db(mongodb_database).collection('users');

router.get('/', async (req, res)=>{
    if (!req.session.authenticated) {
        res.redirect('/login');
        return;
    }

    const email = req.session.email;// email since it is a unice piece of information
    
    const user = await userCollection.find({ email: email}).project({ username: 1, email: 1, registrationMethod: 1, security_question:1, security_answer: 1}).toArray();
    res.render('profile', {navLinks: navLinks, user: user});
});

module.exports = router;