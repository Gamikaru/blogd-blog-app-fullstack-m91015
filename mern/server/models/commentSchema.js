import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const comment = new Schema({
    content: {
        type: String,
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true // Adding an index for better query performance
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Adding an index for better query performance
    },
    likes: {
        type: Number,
        default: 0 // Setting a default value for likes
    },
    time_stamp: {
        type: Date,
        default: Date.now
    }
});

export default model('Comment', comment);