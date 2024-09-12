import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const uri = process.env.ATLAS_URI || "";
console.log("MongoDB URI:", uri);  // This will help verify if the URI is being loaded correctly

if (!uri.startsWith("mongodb")) {
    console.error("Invalid MongoDB URI: Must start with 'mongodb://' or 'mongodb+srv://'");
    process.exit(1);  // Exit the process if the URI is incorrect
}

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 60000, 
            serverSelectionTimeoutMS: 50000,
            connectTimeoutMS: 50000,
        });
        console.log("Successfully connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

connectToMongoDB();

export default mongoose.connection;