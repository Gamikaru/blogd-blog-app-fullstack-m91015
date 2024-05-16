import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import './db/connection.js';
import { authenticate } from './middleware/authMiddleware.js';
import dotenv from 'dotenv';


dotenv.config();



const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', authenticate, userRoutes);


// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

export default app;