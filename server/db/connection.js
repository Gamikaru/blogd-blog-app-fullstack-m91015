// db/connection.js

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const uri = process.env.ATLAS_URI || "";
console.log("MongoDB URI:", uri);  // Verify URI loading

if (!uri.startsWith("mongodb")) {
    console.error("Invalid MongoDB URI: Must start with 'mongodb://' or 'mongodb+srv://'");
    process.exit(1);  // Exit if URI is incorrect
}

mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
        console.log('Connected to MongoDB.');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

export default mongoose.connection;