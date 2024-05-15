import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.ATLAS_URI || "";

try {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 60000, // Increase socket timeout
        serverSelectionTimeoutMS: 50000, // Increase server selection timeout
        connectTimeoutMS: 50000, // Increase connection timeout
    });
    console.log("Successfully connected to MongoDB with Mongoose");
} catch (err) {
    console.error("Error connecting to MongoDB:", err);
}

export default mongoose.connection;