const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { createPost, likeOrDislikePost, getVisiblePosts, editPost, deletePost } = require('../controllers/postController');

const router = express.Router();

// Route to create a new post
router.post('/', verifyToken, createPost);

// Route to like or dislike a specific post
router.patch('/:postId/like', verifyToken, likeOrDislikePost);

// Route to get all visible posts based on privacy settings and following status
router.get('/', verifyToken, getVisiblePosts);

// Route to edit a specific post
router.patch('/:postId', verifyToken, editPost); 

// Route to delete a specific post
router.delete('/:postId', verifyToken, deletePost); // Ensure this line is present

module.exports = router;