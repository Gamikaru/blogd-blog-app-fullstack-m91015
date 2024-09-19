import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const sessionSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    sessionDate: {
        type: Date,
        default: Date.now,
        expires: '24h' // Automatically expires after 24 hours
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

export default model('Session', sessionSchema);
