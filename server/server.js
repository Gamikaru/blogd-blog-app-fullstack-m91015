import dotenv from 'dotenv';
dotenv.config();  // Load environment variables early

import cors from "cors";
import express from "express";
import './db/connection.js'; // Ensure connection.js is executed after dotenv
import { authenticate } from './middleware/authMiddleware.js';
import commentRoutes from "./routes/commentRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/post', authenticate, postRoutes);
app.use('/comment', authenticate, commentRoutes);
app.use('/session', authenticate, sessionRoutes);

// Start the Express server
app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});

export default app;
