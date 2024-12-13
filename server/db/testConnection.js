// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

// const uri = process.env.ATLAS_URI || "";

// const user = new mongoose.Schema({
//     first_name: { type: String, required: true },
//     last_name: { type: String, required: true },
//     birthdate: { type: Date, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     location: { type: String, required: true },
//     occupation: { type: String, required: true }
// });

// const User = mongoose.model('User', user);

// async function testConnection() {
//     try {
//         await mongoose.connect(uri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             socketTimeoutMS: 60000,
//             serverSelectionTimeoutMS: 50000,
//             connectTimeoutMS: 50000
//         });
//         console.log("Successfully connected to MongoDB");

//         const newUser = new User({
//             first_name: "test",
//             last_name: "testlastname",
//             birthdate: new Date('2000-04-05'),
//             email: "test@test.com",
//             password: "hashedpassword",
//             location: "London",
//             occupation: "teacher"
//         });

//         await newUser.save();
//         console.log("User saved successfully");
//     } catch (error) {
//         console.error("Error during operation:", error);
//     } finally {
//         mongoose.connection.close();
//     }
// }

// testConnection();