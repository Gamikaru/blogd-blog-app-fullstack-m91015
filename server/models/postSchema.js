import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
   content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000 // Setting a reasonable maximum size for posts
   },
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
   },
   likes: {
      type: Number,
      default: 0,
      min: 0 // Ensure likes can't go negative
   },
   timeStamp: {
      type: Date,
      default: Date.now
   },
   comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
   }]
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

export default model('Post', postSchema);
