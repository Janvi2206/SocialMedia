const { readFromFile, writeToFile } = require('../utils/fileOperations');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');
const postsFilePath = path.join(__dirname,'../data/posts.json');

// Update account privacy settings (public/private)
const updatePrivacySettings = (req, res) => {
    const { isPrivate } = req.body; // Expecting a boolean value in request body
    const loggedInUser = req.user.username; // Get the username of the logged-in user

    const users = readFromFile(usersFilePath);
    
    const currentUser = users.find(user => user.username === loggedInUser);
    
    if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's privacy setting
    currentUser.isPrivate = isPrivate;
    
    writeToFile(usersFilePath, users); // Save updated users list

    res.status(200).json({ message: `Account privacy updated to ${isPrivate ? 'private' : 'public'}` });
};

// Follow a user function
const followUser = (req, res) => {
    const { username } = req.params;
    const loggedInUser = req.user.username; // Get the username of the logged-in user

    const users = readFromFile(usersFilePath);
    
    const followedUser = users.find(user => user.username === username);
    
    if (!followedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = users.find(user => user.username === loggedInUser);
    
    // Ensure following array is initialized
    if (!currentUser.following) {
        currentUser.following = []; // Initialize following array if it doesn't exist
    }
    
    // Ensure followers array is initialized for the followed user
    if (!followedUser.followers) {
        followedUser.followers = []; // Initialize followers array if it doesn't exist
    }
    
    if (!currentUser.following.includes(username)) {
        currentUser.following.push(username); // Add followed username
        followedUser.followers.push(loggedInUser); // Add to followers of followed user
        writeToFile(usersFilePath, users); // Save updated users list
        return res.status(200).json({ message: `You are now following ${username}` });
    } else {
        return res.status(400).json({ message: `You are already following ${username}` });
    }
};

// Unfollow a user function
const unfollowUser = (req, res) => {
    const { username } = req.params;
    const loggedInUser = req.user.username;

    const users = readFromFile(usersFilePath);
    
    const followedUser = users.find(user => user.username === username);
    
    if (!followedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = users.find(user => user.username === loggedInUser);
    
    if (currentUser.following && currentUser.following.includes(username)) {
        currentUser.following = currentUser.following.filter(user => user !== username); // Remove followed username
        followedUser.followers = followedUser.followers.filter(user => user !== loggedInUser); // Remove from followers of followed user
        writeToFile(usersFilePath, users); // Save updated users list
        return res.status(200).json({ message: `You have unfollowed ${username}` });
    } else {
        return res.status(400).json({ message: `You are not following ${username}` });
    }
};

// View user profile along with their posts
const viewProfile = (req, res) => {
    const { username } = req.params; // Get the username from request parameters
    const loggedInUser = req.user ? req.user.username : null; // Get the username of the logged-in user if authenticated

    const users = readFromFile(usersFilePath);
    const posts = readFromFile(postsFilePath);
    
    const targetUser = users.find(user => user.username === username);
    
    if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if the target user has a private account
    if (targetUser.isPrivate) {
        // If the user is not logged in and is trying to access a private profile
        if (!loggedInUser) {
            return res.status(403).json({ message: 'This profile is private. Please log in to view.' });
        }
        
        // If logged-in user is not following the target user
        if (!users.find(user => user.username === loggedInUser).following.includes(username)) {
            return res.status(403).json({ message: 'You do not have permission to view this profile.' });
        }
    }

    // Fetch posts created by the target user
    const userPosts = posts.filter(post => post.author === username);

    // Return user's profile information along with their posts
    const { password, ...profileData } = targetUser; // Exclude password for security
    res.json({
        profile: profileData,
        posts: userPosts
    });
};

module.exports = { updatePrivacySettings, followUser, unfollowUser, viewProfile };