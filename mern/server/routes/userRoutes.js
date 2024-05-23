import express from 'express';
import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
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
            return res.status(500).send('Server error: ' + error.message);
        }
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please fill in all required fields');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, auth_level: user.auth_level },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token is valid for 24 hours
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                auth_level: user.auth_level,
                first_name: user.first_name,
                last_name: user.last_name,
                location: user.location,
                occupation: user.occupation
            },
            message: 'Login successful'
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Get user info (protected route)
router.get('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Update user info (protected route)
router.put('/user-update/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Only update the fields that are provided in the request body
        const fieldsToUpdate = req.body;
        Object.keys(fieldsToUpdate).forEach((field) => {
            user[field] = fieldsToUpdate[field];
        });

        await user.save();
        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// List all users except for the current user (protected route)
router.get('/list/:id', authenticate, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

export default router;