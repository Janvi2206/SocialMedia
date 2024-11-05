const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readFromFile, writeToFile } = require('../utils/fileOperations');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Signup function
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readFromFile(usersFilePath);
    
    // Check if email or username already exists
    const existingUser = users.find(user => user.email === email || user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object with additional fields
    const newUser = { 
        username,
        email,
        password: hashedPassword,
        role: 'registered', // Default role is registered
        isPrivate: false,   // Public by default
        followers: [],      // Initialize followers array
        following: []       // Initialize following array
    };
    
    // Save user to file
    users.push(newUser);
    writeToFile(usersFilePath, users);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;

    const users = readFromFile(usersFilePath);
    
    const foundUser = users.find(user => user.email === email);
    
    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token including role and username
    const token = jwt.sign({ username: foundUser.username, role: foundUser.role }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
};

module.exports = { signup, login };