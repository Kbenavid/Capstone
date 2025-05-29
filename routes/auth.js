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
        const user = new User({ username }); // create a new user instance
        await user.setPassword(password); // hash the password
        await user.save(); // save the user to the database
        res.status(201).json({ message: 'User registered succefully' });// if registration is successful, send a success message
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Server error' }); // if there's an error during the registration process

    }
});

router.post('login', async (req, res) => {
    const { username, password } = req.body; // extract username and password from request body
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' }); // search for user in the database, return error if not found
        }
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid password' }); // if password does not match, send an error message
        }
        const token = jwt.sign(
            {userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h'} // sign the token with user id and username
        );
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' }); // if there's an error during the login process
    }
});

module.exports = router; // export the router for use in other files.
