// models/session.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const session = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    sessionDate: {
        type: Date,
        default: Date.now,
        expires: '24h' // Session expires after 24 hours
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default model('Session', session);