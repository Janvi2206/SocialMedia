const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/isAdmin');  // Middleware to check if the user is an admin.
const { getAllUsers } = require('../controllers/adminController');

const router = express.Router();

// Route to get all users (admin only)
router.get('/users', verifyToken, isAdminMiddleware, getAllUsers);

module.exports = router;