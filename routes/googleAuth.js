require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongodb_database = process.env.MONGODB_DATABASE;

var { database } = include('databaseConnection');

// connect the collection of users in the database
const userCollection = database.db(mongodb_database).collection('users');

const expireTime = 60 * 60 * 1000;// Hour, minutes, seconds miliseconds



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3050/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
       
        console.log("Email infomation is: " + profile.emails[0].value);
        console.log("Username is: " + profile.name.givenName);

        const emailCheck = profile.emails[0].value;
        const username = profile.name.givenName;
        const existEmail = await userCollection.find({ email: emailCheck }).toArray();
        console.log('existEmail values is: ' + existEmail);

        if (!(existEmail.length > 0)) {
            const method = 'Google'
            await userCollection.insertOne({ username: username, email: emailCheck, registrationMethod: method});
            console.log("User inserted to database.")
        }

        done(null, profile);

    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

