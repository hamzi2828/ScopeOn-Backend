
const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/blogController/blogController');
const verifyToken = require('../../middleware/authMiddleware');

router.post('/create', verifyToken ,blogController.createBlog);  


module.exports = router; 
