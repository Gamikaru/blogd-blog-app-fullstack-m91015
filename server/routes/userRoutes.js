import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/authMiddleware.js';
import Session from '../models/sessionSchema.js';
import User from '../models/userSchema.js';

dotenv.config();

const router = express.Router();

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
   const { firstName, lastName, birthDate, email, password, location, occupation, authLevel } = req.body;
   console.log('User Registration: Received data:', req.body);

   // Validate required fields
   if (!firstName || !lastName || !birthDate || !email || !password || !location || !occupation) {
      console.log('User Registration: Missing required fields.');
      return res.status(400).json({ message: 'Please fill in all required fields.' });
   }

   try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         console.log('User Registration: Email already registered:', email);
         return res.status(409).json({ message: 'Email already registered.' });
      }

      // Create a new user instance
      const newUser = new User({
         firstName,
         lastName,
         birthDate,
         email,
         password, // No need to hash, schema pre-save hook handles it
         location,
         occupation,
         authLevel: authLevel || 'basic',
         status: '',
      });

      // Save the user in the database
      await newUser.save();
      console.log('User Registration: User registered successfully:', newUser);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
   } catch (error) {
      console.error("Error during registration:", error);
      if (error.code === 11000) {
         return res.status(409).json({ message: 'Email already registered.' });
      } else if (error.name === 'ValidationError') {
         return res.status(400).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Server error: ' + error.message });
      }
   }
});

/**
 * @route   POST /login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
   const { email, password } = req.body;
   console.log('User Login: Received credentials:', { email });

   if (!email || !password) {
      console.log('User Login: Missing email or password.');
      return res.status(400).json({ message: 'Please fill in all required fields' });
   }

   try {
      const user = await User.findOne({ email });
      if (!user) {
         console.log('User Login: User not found:', email);
         return res.status(404).json({ message: 'No user found with this email.' });  // Specific message for user not found
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         console.log('User Login: Incorrect password.');
         return res.status(401).json({ message: 'Incorrect password for this user.' });  // Specific message for incorrect password
      }

      const token = jwt.sign(
         { _id: user._id, email: user.email, authLevel: user.authLevel },
         process.env.JWT_SECRET,
         { expiresIn: '24h' }
      );

      console.log('User Login: Token generated successfully.');
      res.status(200).json({
         token,
         user: {
            _id: user._id,
            email: user.email,
            authLevel: user.authLevel,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            occupation: user.occupation
         },
         message: 'Login successful'
      });
   } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: 'Server error: ' + error.message });
   }
});



/**
 * @route   GET /:id
 * @desc    Get user by ID (protected)
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
   console.log('Fetching user data for ID:', req.params.id);
   try {
      // Find user by ID and exclude password
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
         return res.status(404).send('User not found');
      }
      res.status(200).json(user);
   } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   PATCH /:id
 * @desc    Update user by ID (protected)
 * @access  Private
 */
router.patch('/:id', authenticate, async (req, res) => {
   console.log('Updating user with ID:', req.params.id);
   console.log('Fields to update:', req.body); // Log the request body for debugging
   try {
      const user = await User.findById(req.params.id);
      if (!user) {
         return res.status(404).send('User not found');
      }

      // Update only allowed fields
      const fieldsToUpdate = req.body;
      const allowedUpdates = ['firstName', 'lastName', 'birthDate', 'email', 'location', 'occupation', 'authLevel', 'status'];
      Object.keys(fieldsToUpdate).forEach((field) => {
         if (allowedUpdates.includes(field)) {
            user[field] = fieldsToUpdate[field];
         }
      });

      await user.save(); // Don't forget to save the updated user data
      res.status(200).send(user); // Send updated user back to front-end
   } catch (error) {
      res.status(500).send('Error updating user');
   }
});

/**
 * @route   GET /list/:id
 * @desc    Get all users except the current user (protected)
 * @access  Private
 */
router.get('/list/:id', authenticate, async (req, res) => {
   console.log('Fetching all users except for user ID:', req.params.id);
   try {
      const users = await User.find({ _id: { $ne: req.params.id } });
      res.status(200).json(users);
   } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   GET /
 * @desc    Get all users (protected)
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
   console.log('Fetching all users.');
   try {
      const users = await User.find();
      res.status(200).json(users);
   } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   DELETE /:id
 * @desc    Delete user by ID (protected)
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
   console.log('Deleting user with ID:', req.params.id);
   try {
      const user = await User.findById(req.params.id);
      if (!user) {
         return res.status(404).send('User not found');
      }
      await user.deleteOne();
      res.status(200).send('User deleted successfully');
   } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).send('Server error: ' + error.message);
   }
});

// Delete user by email (ensure this route uses the authenticate middleware)
router.delete('/email/:email', async (req, res) => {
   console.log('Deleting user with email:', req.params.email);
   try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) {
         return res.status(404).send('User not found');
      }
      await user.deleteOne();
      return res.status(200).send('User deleted successfully');
   } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).send('Server error: ' + error.message);
   }
});
/**
 * @route   PUT /:id/status
 * @desc    Update user status (protected)
 * @access  Private
 */
router.put('/:id/status', authenticate, async (req, res) => {
   const { id } = req.params;
   const { status } = req.body;
   console.log('PUT request to update status for user ID:', id, 'with new status:', status); // Add detailed logging

   try {
      const user = await User.findByIdAndUpdate(id, { status }, { new: true });
      if (!user) {
         return res.status(404).send('User not found');
      }
      res.json(user);
   } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Error updating status', error });
   }
});

/**
 * @route   POST /logout
 * @desc    Logout user and delete session (protected)
 * @access  Private
 */
router.post('/logout', authenticate, async (req, res) => {
   console.log('Logging out user with ID:', req.user._id);
   try {
      const endSession = await Session.findOneAndDelete({ user: req.user._id });
      res.status(200).send('Session ended: User logged out');
   } catch (error) {
      console.error('Error ending session:', error);
      res.status(500).send('Error ending session');
   }
});

export default router;
