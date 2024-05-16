import mongoose from 'mongoose';    

const { Schema, model } = mongoose; 

const sessionSchema = new Schema({
    session_id: String,
    sessions_date: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default model('Session', sessionSchema);
