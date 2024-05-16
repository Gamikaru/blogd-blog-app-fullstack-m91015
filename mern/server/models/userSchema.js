import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    occupation: { type: String, required: true },
    auth_level: { type: String, default: 'basic' },
    status: { type: String, default: '' }
});

export default model('User', userSchema);