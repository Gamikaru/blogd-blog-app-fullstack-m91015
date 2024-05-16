import express from 'express';
import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
    const { first_name, last_name, birthdate, email, password, location, occupation, auth_level } = req.body;

    if (!first_name || !last_name || !birthdate || !email || !password || !location || !occupation) {
        return res.status(400).send('Please fill in all required fields');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Please enter a valid email address');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('Email already registered');
        }

        const newUser = new User({
            first_name,
            last_name,
            birthdate,
            email,
            password: hashedPassword,
            location,
            occupation,
            auth_level: auth_level || 'basic', // default to 'basic' if not provided
            status: '' // default to empty string
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error("Error during registration:", error);
        if (error.code === 11000) {
            return res.status(409).send('Email already registered');
        } else if (error.name === 'ValidationError') {
            return res.status(400).send(error.message);
        } else {
            return res.status(500).send('Server error:' + error.message);
        }
    }
});

export default router;