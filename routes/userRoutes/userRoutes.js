const express = require('express');
const router = express.Router();
const  userController = require('../../controllers/userCotroller/userController');
const roleController = require('../../controllers/roleController/roleController');
const verifyToken = require('../../middleware/authMiddleware'); 


// User
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update', verifyToken, userController.updateUser);  
router.post('/forgot-password', userController.forgotPassword); 
router.post('/reset-password/:token', userController.resetPassword); 
router.get('/:id', userController.getUserById); 
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome to your profile, ${req.user.fullname}` });
});


// Roles
router.post('/roles/createRoles', verifyToken ,roleController.createRole);
router.put('/roles/updateRoles/:roleId', verifyToken ,roleController.updateRole);
router.delete('/roles/deleteRoles/:roleId', verifyToken ,roleController.deleteRole);
router.get('/roles/getRolesById/:roleId', roleController.getRoleById);
router.get('/roles/getAllRoles' ,roleController.getAllRoles);



module.exports = router;
