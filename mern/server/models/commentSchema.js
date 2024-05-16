import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: String,
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: Number,
    time_stamp: { type: Date, default: Date.now }
});

export default model('Comment', commentSchema);