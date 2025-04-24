
const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/blogController/blogController');
const verifyToken = require('../../middleware/authMiddleware');

//Blog
router.post('/create', verifyToken ,blogController.createBlog); 
router.put('/updateBlog/:blogId',verifyToken, blogController.updateBlog);
router.delete('/deleteBlog/:blogId', verifyToken, blogController.deleteBlog);
router.get('/getAllBlogs', blogController.getAllBlogs);
router.get('/getBlog/:blogId', blogController.getBlogById);
router.put('/like/:blogId', verifyToken ,blogController.likeBlog);
router.put('/dislike/:blogId', verifyToken,blogController.dislikeBlog);
router.get('/search', blogController.searchBlogByTitle);


//Comments
router.post('/addComment/:blogId', verifyToken ,blogController.addCommentByBlogId); 
router.put('/updateComment/:blogId', verifyToken, blogController.updateCommentByBlogId);
router.delete('/deleteComment/:blogId', verifyToken, blogController.deleteCommentByBlogId);
router.get('/comments/:blogId', blogController.getAllCommentsByBlogId);
router.get('/getComment/:blogId', blogController.getCommentById);
router.put('/comment/:blogId/:commentId/like', verifyToken,blogController.likeComment);
router.put('/comment/:blogId/:commentId/dislike',verifyToken ,blogController.dislikeComment);


module.exports = router; 
