require('dotenv');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');

const saltRound = 12;
const mongodb_database = process.env.MONGODB_DATABASE;

var { database } = include('databaseConnection');

//connect the collection of users in the database
const userCollection = database.db(mongodb_database).collection('users');

router.post('/', async (req, res) =>{
    let email = req.session.email;
    let newPassword = req.body.password;
    console.log("Email to change password: "+ email);

    const schema = Joi.object({
        newPassword: Joi.string().max(20).required()
    });
    
    // validates if the password and username are a string 
    // with max length of 20 characters
    const validationResult = schema.validate({newPassword});
    if(validationResult.error != null){
        console.log("Validation error with joi: " + validationResult.error);
        res.redirect('/login/2');
        return;
    }

    let hashPassword = await bcrypt.hash(newPassword, saltRound);

    await userCollection.updateOne({ email }, { $set: { password: hashPassword } });
    console.log('Password updated succesfully');

    res.redirect('/login/4');
});

module.exports = router;