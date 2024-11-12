// migratePosts.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Post from '../models/postSchema.js'; // Adjust the path as needed

dotenv.config();

const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/your_database_name";

async function migratePosts() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB for migration.");

        // 1. Update 'likesBy' field
        const likesByResult = await Post.updateMany(
            { likesBy: { $exists: false } },
            { $set: { likesBy: [] } }
        );
        console.log(`'likesBy' field updated for ${likesByResult.modifiedCount} posts.`);

        // 2. Update 'editHistory' field
        const editHistoryResult = await Post.updateMany(
            { editHistory: { $exists: false } },
            { $set: { editHistory: [] } }
        );
        console.log(`'editHistory' field updated for ${editHistoryResult.modifiedCount} posts.`);

        // 3. Update 'excerpt' field
        const postsMissingExcerpt = await Post.find({ excerpt: { $exists: false } });
        console.log(`Found ${postsMissingExcerpt.length} posts missing 'excerpt'. Updating...`);

        for (let post of postsMissingExcerpt) {
            // Remove HTML tags
            const contentText = post.content.replace(/<[^>]*>?/gm, ' ');
            const words = contentText.split(/\s+/).slice(0, 40).join(' ');
            const excerpt = words + (contentText.split(/\s+/).length > 40 ? '...' : '');

            post.excerpt = excerpt;
            await post.save();
            console.log(`Updated 'excerpt' for post ID: ${post._id}`);
        }

        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

migratePosts();
