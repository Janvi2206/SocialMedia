const { readFromFile } = require('../utils/fileOperations');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Get all users (admin only)
const getAllUsers = (req, res) => {
   const users = readFromFile(usersFilePath);
   res.json(users);  // Return all users data to admin.
};

module.exports = { getAllUsers };