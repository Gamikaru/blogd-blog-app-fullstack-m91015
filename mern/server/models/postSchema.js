import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const post = new Schema({
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    likes: {
        type: Number,
        default: 0
    },
    time_stamp: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

export default model('Post', post);