const express = require('express');  
const router = express.Router(); // create a router
const jwt = require('jsonwebtoken'); // create jwt tokens
const User = require('../models/User'); // import user model
const bcrypt = require('bcryptjs'); // hash passwords

router.post('/register',async (req, res) => {
    const { username, password } = req.body; // extract username and password from request body
    try {
        //check if user already exists
        let existingUser = await User.findOne({ username});
        if (existingUser) { 
            return res.status(400).json({ message: 'User already exists' });
        }
        
    }
})
