// models/postSchema.js

import mongoose from 'mongoose';
import { validCategories } from '../middleware/validationMiddleware.js'; // Import the centralized categories

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 10000,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        likes: {
            type: Number,
            default: 0,
            min: 0,
        },
        likesBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        views: {
            type: Number,
            default: 0,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            enum: validCategories,
        },
        tags: [{ type: String }],
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
        },
        scheduledAt: {
            type: Date,
        },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        imageUrls: [{ type: String }],
        editHistory: [
            {
                editedAt: {
                    type: Date,
                    default: Date.now,
                },
                content: String,
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // Include virtuals when converting to JSON
        toObject: { virtuals: true },
    }
);

/**
 * Middleware to generate slug.
 */
postSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        // Generate slug based on title
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Ensure slug is unique
        const existingPost = await this.constructor.findOne({
            slug: this.slug,
            _id: { $ne: this._id },
        });
        if (existingPost) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }

    next();
});

// Virtual field for excerpt
postSchema.virtual('excerpt').get(function () {
    const strippedContent = this.content.replace(/(<([^>]+)>)/gi, ''); // Strip HTML tags
    const words = strippedContent.split(' ').slice(0, 40).join(' ');
    return words + (strippedContent.split(' ').length > 40 ? '...' : '');
});

export default model('Post', postSchema);