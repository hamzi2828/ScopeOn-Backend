const express = require('express');
const router = express.Router();
const { registerUser, 
  loginUser, 
  updateUser, 
  forgotPassword, 
  resetPassword } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); 


router.post('/register', registerUser);


router.post('/login', loginUser);



router.put('/update', verifyToken, updateUser);  



router.post('/forgot-password', forgotPassword); 

router.post('/reset-password/:token', resetPassword); 

router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome to your profile, ${req.user.fullname}` });
});

module.exports = router;
