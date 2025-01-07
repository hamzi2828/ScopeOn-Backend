const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();  // Load environment variables from .env file

const port = 3000;


const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token after 'Bearer'
  
    if (!token) {
      return res.status(403).json({ message: 'Access Denied' });
    }
  
    try {
      // Verify the token with the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;  // Attach the decoded user information to the request
      next();  // Pass the request to the next middleware or route handler
    } catch (err) {
      return res.status(400).json({ message: 'Invalid Token' });
    }
  };

  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
