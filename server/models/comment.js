// models/comment.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const comment = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10000
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: {
        type: Number,
        default: 0
    },
    likesBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    timeStamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default model('Comment', comment);
