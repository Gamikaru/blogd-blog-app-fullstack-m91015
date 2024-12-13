// // migrateUsers.js

// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import User from '../../models/user.js'; // Adjust the path if needed

// dotenv.config();

// // Connect to MongoDB
// mongoose.connect(process.env.ATLAS_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => {
//         console.log('MongoDB connected for migration.');
//     })
//     .catch(err => {
//         console.error('MongoDB connection error:', err);
//         process.exit(1);
//     });

// /**
//  * Add default fields to existing users and verify the changes.
//  */
// const addDefaultFields = async () => {
//     try {
//         // Update users with missing profilePicture or coverPicture fields
//         const result = await User.updateMany(
//             {
//                 $or: [
//                     { profilePicture: { $exists: false } },
//                     { coverPicture: { $exists: false } }
//                 ]
//             },
//             {
//                 $set: {
//                     profilePicture: '',
//                     coverPicture: ''
//                 }
//             }
//         );
//         console.log(`Migration completed. Modified ${result.modifiedCount} user(s).`);

//         // Verify the changes
//         const users = await User.find({
//             profilePicture: { $exists: true },
//             coverPicture: { $exists: true }
//         });
//         console.log(`Users with updated fields: ${users.length}`);
//     } catch (error) {
//         console.error('Migration failed:', error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// addDefaultFields();