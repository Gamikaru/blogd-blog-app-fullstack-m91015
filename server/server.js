// server.js

import dotenv from 'dotenv';
dotenv.config();  // Load environment variables early

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import './db/connection.js'; // Ensure connection.js is executed after dotenv

import authRoutes from "./routes/authRoutes.js"; // Authentication Routes
import commentRoutes from "./routes/commentRoutes.js"; // Comment Management Routes
import postRoutes from "./routes/postRoutes.js"; // Post Management Routes
import sessionRoutes from "./routes/sessionRoutes.js"; // Session Management Routes
import userRoutes from "./routes/userRoutes.js"; // User Management Routes

import logger from './utils/logger.js';

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Security Middleware
app.use(helmet());

// Logging Middleware
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Routes with /api Prefix
app.use('/api/auth', authRoutes);       // Mounting Authentication Routes
app.use('/api/user', userRoutes);       // User Management Routes
app.use('/api/post', postRoutes);       // Post Management Routes
app.use('/api/comment', commentRoutes); // Comment Management Routes
app.use('/api/session', sessionRoutes); // Session Management Routes

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error('Global Error Handler:', { error: err.message });
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the Express server
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

export default app;