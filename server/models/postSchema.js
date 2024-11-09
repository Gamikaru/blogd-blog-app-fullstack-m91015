import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        maxlength: 100 // Limit title to 100 characters
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10000 // Increase maximum size for posts
    },
    excerpt: {
        type: String,
        maxlength: 300 // Short summary of the post
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
    views: {
        type: Number,
        default: 0,
        min: 0 // Ensure views can't go negative
    },
    category: {
        type: String,
        required: true,
        enum: ['Health and Fitness', 'Lifestyle', 'Technology', 'Cooking', 'Other'] // Define allowed categories
    },
    tags: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    scheduledAt: {
        type: Date
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    imageUrls: [{
        type: String
    }],
    images: [{
        data: {
            type: String // Base64-encoded image data
        },
        isLink: {
            type: Boolean,
            default: false // Flag to indicate if the image is from a link or an upload
        }
    }],
    editHistory: [{
        editedAt: {
            type: Date,
            default: Date.now
        },
        content: String
    }]
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Middleware to generate slug from title
postSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    next();
});

export default model('Post', postSchema);
