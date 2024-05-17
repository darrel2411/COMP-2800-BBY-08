require('dotenv');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const saltRound = 12;
const mongodb_database = process.env.MONGODB_DATABASE;

var { database } = include('databaseConnection');

//connect the collection of users in the database
const userCollection = database.db(mongodb_database).collection('users');

// step 2 confirm user's identity and display security question 
router.post('/', async (req, res) => {
    let email = req.body.email;

    //check is the email same email
    const sameEmail = await userCollection.find({email: email}).toArray();
    if(!(sameEmail.length > 0)){
        res.redirect('/login'); //if it does then it will be redirected to sign up
        return;
    }
    const question = await userCollection.find({ email: email}).project({ security_question: 1, email: 1}).toArray();
    req.session.email = question[0].email // to able to use it in the next step and to display it in the next pages

    res.render('secQuestion', {question: question[0].security_question, user: req.session.email});
});

module.exports = router;