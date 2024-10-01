import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 1, // Ensures a comment has at least one character
        maxlength: 1000 // Limit comment length to a reasonable size
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true // Add index for faster queries on postId
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Add index for faster queries on userId
    },
    likes: {
        type: Number,
        default: 0
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

export default model('Comment', commentSchema);
