const express = require('express');
const authRoutes = require('./routes/auth');  // Import auth routes for signup/login
const userRoutes = require('./routes/users');  // Import user routes for managing accounts
const adminRoutes = require('./routes/admin');  // Import admin routes
const postRoutes = require('./routes/posts');   // Import post routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // Middleware to parse JSON requests

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use user routes with protected endpoints for managing accounts
app.use('/api/users', userRoutes);

// Use admin routes with protected endpoints for managing accounts by admins only 
app.use('/api/admin', adminRoutes);

// Use routes for managing posts
app.use('/api/posts', postRoutes);

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});