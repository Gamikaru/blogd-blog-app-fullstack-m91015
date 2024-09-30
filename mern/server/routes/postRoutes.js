import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import Post from '../models/postSchema.js';

const router = express.Router();

/**
 * @route   POST /
 * @desc    Create a new post
 * @access  Private (Authentication required)
 */
router.post('/', authenticate, async (req, res) => {
   const { content } = req.body;
   const userId = req.user._id;
   console.log('Creating a new post for user:', userId, 'with content:', content);

   // Validate content
   if (!content || content.length < 1) {
      console.log('Post creation failed: No content provided.');
      return res.status(400).send('Please enter some content to post');
   }

   try {
      const newPost = new Post({
         content,
         userId,
         likes: 0,
         comments: [],
         // timestamps created automatically by Mongoose
      });

      // Save the post to the database
      await newPost.save();
      console.log('Post created successfully:', newPost);

      // Send back all necessary fields
      return res.status(201).json({
         message: 'Post created successfully',
         post: {
            _id: newPost._id,
            content: newPost.content,
            likes: newPost.likes,
            userId: newPost.userId,
            comments: newPost.comments,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt
         }
      });
   } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   GET /:id
 * @desc    Get all posts by a specific user
 * @access  Private (Authentication required)
 */
router.get('/:id', authenticate, async (req, res) => {
   console.log(`Fetching posts for user ${req.params.id}`);
   try {
      const posts = await Post.find({ userId: req.params.id });
      console.log('Posts retrieved successfully:', posts);
      res.status(200).send(posts);
   } catch (error) {
      console.error('Error getting posts:', error);
      res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   GET /
 * @desc    Get all posts (sorted by timestamp)
 * @access  Private (Authentication required)
 */
// Fetch all posts with user details (firstName, lastName)
router.get('/', authenticate, async (req, res) => {
   console.log('Fetching all posts.');
   try {
      const posts = await Post.find()
         .populate('userId', 'firstName lastName')  // Populate user details
         .sort({ timeStamp: -1 });
      console.log('All posts retrieved successfully.');
      res.status(200).send(posts);
   } catch (error) {
      console.error('Error retrieving posts:', error);
      res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   GET /user/:id
 * @desc    Get all posts by a specific user
 * @access  Private (Authentication required)
 */
router.get('/user/:id', authenticate, async (req, res) => {
   console.log(`Fetching all posts for user ${req.params.id}`);
   try {
      const posts = await Post.find({ userId: req.params.id });
      console.log(`Posts by user ${req.params.id}:`, posts);
      res.status(200).send(posts);
   } catch (error) {
      console.error('Error getting posts:', error);
      res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   GET /specific/:id
 * @desc    Get a single post by ID
 * @access  Private (Authentication required)
 */
router.get('/specific/:id', authenticate, async (req, res) => {
   console.log('Fetching post with ID:', req.params.id);
   try {
      const post = await Post.findById(req.params.id);
      if (!post) {
         console.log('Post not found with ID:', req.params.id);
         return res.status(404).send('Post not found');
      }
      console.log('Post fetched successfully:', post);
      res.status(200).send(post);
   } catch (error) {
      console.error('Error getting post:', error);
      res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   PATCH /:id
 * @desc    Update a post by ID
 * @access  Private (Authentication required)
 */
router.patch('/:id', authenticate, async (req, res) => {
   console.log('Updating post with ID:', req.params.id);
   try {
      const post = await Post.findById(req.params.id);
      if (!post) {
         console.log('Post not found:', req.params.id);
         return res.status(404).json({ success: false, message: 'Post not found' });
      }

      const fieldsToUpdate = req.body;
      Object.keys(fieldsToUpdate).forEach((field) => {
         post[field] = fieldsToUpdate[field];
      });

      await post.save();
      console.log('Post updated successfully:', post);

      // Return the updated post with all necessary fields
      return res.status(200).json({
         success: true,
         post: {
            _id: post._id,
            content: post.content,
            likes: post.likes,
            userId: post.userId,
            comments: post.comments,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
         }
      });
   } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
   }
});

/**
 * @route   DELETE /:id
 * @desc    Delete a post by ID
 * @access  Private (Authentication required)
 */
router.delete('/:id', authenticate, async (req, res) => {
   console.log('Deleting post with ID:', req.params.id);
   try {
      const post = await Post.findById(req.params.id);
      if (!post) {
         console.log('Post not found:', req.params.id);
         return res.status(404).json({ success: false, message: 'Post not found' });
      }

      await post.deleteOne();
      console.log('Post deleted successfully:', req.params.id);
      return res.status(200).json({ success: true, message: 'Post deleted successfully' }); // Return JSON instead of plain text
   } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
   }
});


/**
 * @route   PUT /like/:id
 * @desc    Like a post
 * @access  Private (Authentication required)
 */
router.put('/like/:id', authenticate, async (req, res) => {
   console.log('Liking post with ID:', req.params.id);
   try {
      const post = await Post.findById(req.params.id);
      if (!post) {
         console.log('Post not found:', req.params.id);
         return res.status(404).send('Post not found');
      }

      post.likes += 1;
      await post.save();
      console.log('Post liked successfully:', post);
      res.status(200).json(post);
   } catch (error) {
      console.error('Error liking post:', error);
      return res.status(500).send('Server error: ' + error.message);
   }
});

/**
 * @route   PUT /unlike/:id
 * @desc    Unlike a post
 * @access  Private (Authentication required)
 */
router.put('/unlike/:id', authenticate, async (req, res) => {
   console.log('Unliking post with ID:', req.params.id);
   try {
      const post = await Post.findById(req.params.id);
      if (!post) {
         console.log('Post not found:', req.params.id);
         return res.status(404).send('Post not found');
      }

      post.likes = Math.max(0, post.likes - 1); // Ensure likes don't go below 0
      await post.save();
      console.log('Post unliked successfully:', post);
      res.status(200).send('Post unliked successfully');
   } catch (error) {
      console.error('Error unliking post:', error);
      return res.status(500).send('Server error: ' + error.message);
   }
});

export default router;
