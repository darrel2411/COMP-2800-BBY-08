require('dotenv');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const saltRound = 12;
const mongodb_database = process.env.MONGODB_DATABASE;

var { database } = include('databaseConnection');

//connect the collection of users in the database
const userCollection = database.db(mongodb_database).collection('users');

router.post('/', async (req, res) =>{
    let answer = req.body.secAnswer;
    let email = req.session.email;
    console.log("email is: "+ req.session.email);
    
    const sameAnswer = await userCollection.find({ email: email}).project({ security_answer: 1, email: 1}).toArray();

    console.log(sameAnswer)
    const correctA = sameAnswer[0].security_answer;
    console.log(correctA);
    if(correctA === answer){
        res.render('changePassword', {user: sameAnswer[0].email});
        return;
    }

    res.redirect('/login');
});

module.exports = router;