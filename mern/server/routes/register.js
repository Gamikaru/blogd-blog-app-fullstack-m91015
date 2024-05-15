import express from 'express';
import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req, res) => {
    const { first_name, last_name, birthdate, email, password, location, occupation } = req.body;
    if (!first_name || !last_name || !birthdate || !email || !password || !location || !occupation) {
        return res.status(400).send('Please fill in all required fields');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            first_name,
            last_name,
            birthdate,
            email,
            password: hashedPassword,
            location,
            occupation
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).send('Email already registered');
        } else if (error.name === 'ValidationError') {
            return res.status(400).send(error.message);
        } else {
            return res.status(500).send('Server error:' + error.message);
        }

    }
}

);


export default router;




