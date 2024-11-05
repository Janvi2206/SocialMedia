const { readFromFile, writeToFile } = require('../utils/fileOperations');
const path = require('path');

const postsFilePath = path.join(__dirname, '../data/posts.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Create a new post
const createPost = (req, res) => {
    const { title, content } = req.body;
    const author = req.user.username;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const posts = readFromFile(postsFilePath);
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        author,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: []
    };

    posts.push(newPost);
    
    // Ensure this line is executed
    writeToFile(postsFilePath, posts);

    res.status(201).json({ message: 'Post created successfully', post: newPost });
};

// Like or dislike a post
const likeOrDislikePost = (req, res) => {
    const { postId } = req.params;
    const action = req.body.action; // 'like' or 'dislike'
    const username = req.user.username;

    const posts = readFromFile(postsFilePath);
    const post = posts.find(p => p.id === parseInt(postId));

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (action === 'like') {
        if (post.likedBy.includes(username)) {
            // Already liked, now dislike it
            post.likes--;
            post.likedBy = post.likedBy.filter(user => user !== username);
            post.dislikes++;
            post.dislikedBy.push(username);
            writeToFile(postsFilePath, posts); // Save updated posts list
            return res.status(200).json({ message: 'Post disliked', post });
        } else {
            // Like the post
            post.likes++;
            post.likedBy.push(username);
            writeToFile(postsFilePath, posts); // Save updated posts list
            return res.status(200).json({ message: 'Post liked', post });
        }
    } else if (action === 'dislike') {
        if (post.dislikedBy.includes(username)) {
            // Already disliked, now like it
            post.dislikes--;
            post.dislikedBy = post.dislikedBy.filter(user => user !== username);
            post.likes++;
            post.likedBy.push(username);
            writeToFile(postsFilePath, posts); // Save updated posts list
            return res.status(200).json({ message: 'Post liked', post });
        } else {
            // Dislike the post
            post.dislikes++;
            post.dislikedBy.push(username);
            writeToFile(postsFilePath, posts); // Save updated posts list
            return res.status(200).json({ message: 'Post disliked', post });
        }
    } else {
        return res.status(400).json({ message: 'Invalid action. Use "like" or "dislike".' });
    }
};

// Get all visible posts based on user's following status and privacy settings
const getVisiblePosts = (req, res) => {
    const users = readFromFile(usersFilePath);
    const posts = readFromFile(postsFilePath);
    
    const loggedInUser = req.user.username;
    
    const currentUser = users.find(user => user.username === loggedInUser);
    
    if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const visiblePosts = posts.filter(post => {
        const isAuthorPrivate = users.find(user => user.username === post.author)?.isPrivate;

        if (isAuthorPrivate) {
            return currentUser.following.includes(post.author); // Only show if followed
        }
        
        return true; // Show public posts
    });

    res.json(visiblePosts);
};

// Edit a post
const editPost = (req, res) => {
    const { postId } = req.params; // Get postId from request parameters
    const { title, content } = req.body; // Expecting { "title": "...", "content": "..." }
    const username = req.user.username; // Get the username of the logged-in user

    const posts = readFromFile(postsFilePath);
    const post = posts.find(p => p.id === parseInt(postId));

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author of the post
    if (post.author !== username) {
        return res.status(403).json({ message: 'You do not have permission to edit this post.' });
    }

    // Update post details
    if (title) post.title = title;
    if (content) post.content = content;

    // Write updated posts list back to the file
    writeToFile(postsFilePath, posts);

    res.status(200).json({ message: 'Post updated successfully', post });
};

// Delete a post
const deletePost = (req, res) => {
    const { postId } = req.params; // Get postId from request parameters
    const username = req.user.username; // Get the username of the logged-in user
    const userRole = req.user.role; // Get the role of the logged-in user (e.g., 'admin')

    const posts = readFromFile(postsFilePath);
    const postIndex = posts.findIndex(p => p.id === parseInt(postId));

    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const post = posts[postIndex];

    // Check if the logged-in user is the author of the post or an admin
    if (post.author !== username && userRole !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to delete this post.' });
    }

    // Remove the post from the array
    posts.splice(postIndex, 1);

    // Write updated posts list back to the file
    writeToFile(postsFilePath, posts);

    res.status(200).json({ message: 'Post deleted successfully' });
};

module.exports = { createPost, likeOrDislikePost, getVisiblePosts, editPost, deletePost };