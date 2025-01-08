const express = require('express');
const router = express.Router();
const  userController = require('../../controllers/userCotroller/userController');
const verifyToken = require('../../middleware/authMiddleware'); 


router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.put('/update', verifyToken, userController.updateUser);  

router.post('/forgot-password', userController.forgotPassword); 

router.post('/reset-password/:token', userController.resetPassword); 

router.get('/:id', userController.getUserById); 


router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome to your profile, ${req.user.fullname}` });
});

module.exports = router;
