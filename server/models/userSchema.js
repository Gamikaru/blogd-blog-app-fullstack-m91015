import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'], // Email validation with regex
        index: true // Add an index for faster lookups
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    authLevel: {
        type: String,
        enum: ['basic', 'admin'], // Enum ensures only valid roles are stored
        default: 'basic'
    },
    status: {
        type: String,
        default: ''
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    profilePicture: {
        type: String
    },
    coverPicture: {
        type: String
    }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

export default model('User', userSchema);
