const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { updatePrivacySettings, followUser, unfollowUser, viewProfile } = require('../controllers/userController');

const router = express.Router();

// Route to update account privacy settings (public/private)
router.patch('/settings/privacy', verifyToken, updatePrivacySettings);

// Route to follow a user
router.post('/follow/:username', verifyToken, followUser);

// Route to unfollow a user
router.post('/unfollow/:username', verifyToken, unfollowUser);

// Route to view a user's profile (allow guest access)
router.get('/profile/:username', viewProfile); // No verifyToken middleware here

module.exports = router;