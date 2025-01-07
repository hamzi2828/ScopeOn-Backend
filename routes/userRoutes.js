const express = require('express');
const router = express.Router();
const { registerUser, 
  loginUser, 
  updateUser, 
  forgotPassword, 
  resetPassword } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); // Optional middleware


router.post('/register', registerUser);


router.post('/login', loginUser);



router.put('/update', verifyToken, updateUser);  // verifyToken applied as middleware



router.post('/forgot-password', forgotPassword); // Endpoint for requesting a password reset link


router.post('/reset-password/:token', resetPassword); // Endpoint for resetting the password using the token

router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome to your profile, ${req.user.fullname}` });
});

module.exports = router;
