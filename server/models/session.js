// models/session.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
    {
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual field for userId (optional, if needed)
sessionSchema.virtual('userId').get(function () {
    return this.user;
});

export default model('Session', sessionSchema);