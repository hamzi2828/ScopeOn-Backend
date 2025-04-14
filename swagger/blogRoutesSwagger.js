/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Blog comments management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - author
 *         - title
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         author:
 *           type: string
 *           description: The user ID of the blog author
 *         title:
 *           type: string
 *           description: The blog title
 *         description:
 *           type: string
 *           description: The blog content
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for the blog
 *         metaTitle:
 *           type: string
 *           description: SEO meta title
 *         metaDescription:
 *           type: string
 *           description: SEO meta description
 *         metaSchema:
 *           type: string
 *           description: SEO schema markup
 *         category:
 *           type: string
 *           description: Blog category
 *         likes:
 *           type: number
 *           description: Number of likes
 *         dislikes:
 *           type: number
 *           description: Number of dislikes
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs who liked the blog
 *         dislikedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs who disliked the blog
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Comments on the blog
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the blog was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the blog was last updated
 *
 *     Comment:
 *       type: object
 *       required:
 *         - author
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         author:
 *           type: string
 *           description: The user ID of the comment author
 *         content:
 *           type: string
 *           description: The comment content
 *         likes:
 *           type: number
 *           description: Number of likes
 *         dislikes:
 *           type: number
 *           description: Number of dislikes
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs who liked the comment
 *         dislikedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: User IDs who disliked the comment
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the comment was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the comment was last updated
 */

/**
 * @swagger
 * /api/blogs/create:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               metaSchema:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/updateBlog/{blogId}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               metaSchema:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/deleteBlog/{blogId}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/getAllBlogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *       404:
 *         description: No blogs found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/getBlog/{blogId}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/like/{blogId}:
 *   put:
 *     summary: Like or unlike a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog like status updated successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/dislike/{blogId}:
 *   put:
 *     summary: Dislike or undislike a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog dislike status updated successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/search:
 *   get:
 *     summary: Search blogs by title
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term
 *     responses:
 *       200:
 *         description: Search results
 *       404:
 *         description: No blogs found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/addComment/{blogId}:
 *   post:
 *     summary: Add a comment to a blog
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/updateComment/{blogId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *               - content
 *             properties:
 *               commentId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/deleteComment/{blogId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *             properties:
 *               commentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the author
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/comments/{blogId}:
 *   get:
 *     summary: Get all comments for a blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Blog not found or no comments
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/getComment/{blogId}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/comment/{blogId}/{commentId}/like:
 *   put:
 *     summary: Like or unlike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment like status updated successfully
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/blogs/comment/{blogId}/{commentId}/dislike:
 *   put:
 *     summary: Dislike or undislike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment dislike status updated successfully
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Server error
 */

module.exports = {}; // This file is just for documentation
