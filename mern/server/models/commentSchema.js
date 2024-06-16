import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true 
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
    }
});

export default model('Comment', commentSchema);