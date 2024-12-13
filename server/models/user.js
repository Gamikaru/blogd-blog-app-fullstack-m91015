// models/user.js

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
            index: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        occupation: {
            type: String,
            required: true,
            trim: true,
        },
        authLevel: {
            type: String,
            enum: ['basic', 'admin'],
            default: 'basic',
        },
        status: {
            type: String,
            default: '',
            trim: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        profilePicture: {
            type: String,
        },
        coverPicture: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual field for userId
userSchema.virtual('userId').get(function () {
    return this._id;
});

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