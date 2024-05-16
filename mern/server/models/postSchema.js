import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
    content: String,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: Number,
    time_stamp: { type: Date, default: Date.now },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

export default model('Post', postSchema);