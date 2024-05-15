import mongoose from 'mongoose';

const { Schema, model } = mongoose;

//the schema for the post should include the user_id, content, likes (integer), and comments. The user_id should be a reference to the user schema.
const postSchema = new Schema({
        _id: ObjectId,
    content: String,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: Number,
    time_stamp: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

export default model('Post', postSchema);