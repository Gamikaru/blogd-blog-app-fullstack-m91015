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
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default model('Session', sessionSchema);