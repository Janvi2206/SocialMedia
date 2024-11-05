// authMiddleware.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
   const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

   if (!token) {
       return res.status(403).json({ message: 'A token is required for authentication' });
   }

   try {
       const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify token using your secret key
       req.user = decoded; // Attach decoded information to request object
   } catch (err) {
       return res.status(401).json({ message: 'Invalid Token' });
   }
   
   return next(); // Proceed to the next middleware or route handler
};

module.exports = verifyToken;