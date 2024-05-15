import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
    _id: Types.ObjectId,
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    birthdate: { type: Date, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: String,
    location: { type: String, required: true},
    occupation: { type: String, required: true},
    auth_level: String
});

export default model('User', userSchema);