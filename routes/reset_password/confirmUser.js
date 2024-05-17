const express = require('express');
const router = express.Router();


// step 1 get user's identity
// To reset the password
router.get('/', (req,res) =>{
    
    res.render('verifyEmail'); 
});

module.exports =  router;