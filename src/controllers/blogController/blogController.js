// controllers/blogController.js
const { Blog } = require('../../models/Blog');
const { User } = require('../../models/User');


const blogController = {
  //Blogs
    createBlog : async (req, res) => {
        const { description, title, tags, metaTitle, metaDescription, metaSchema, category } = req.body;
        console.log('Request Body:', req.body);
        console.log('Authenticated User:', req.user);
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
          }
          const user = await User.findById(req.user._id);
       if (!user) {
          return res.status(404).json({ message: 'User not found' });
            }
          const newBlog = new Blog({
            author: req.user._id,
            description,
            title,
            tags,
            metaTitle,
            metaDescription,
            metaSchema,
            category
          });

      
          // Save the blog to the database
          await newBlog.save();
      
          // Respond with success message and the created blog data
          res.status(201).json({
            message: 'Blog created successfully',
            blog: newBlog
          });
        } catch (err) {
          console.error('Error creating blog:', err);
          res.status(500).json({ message: 'Server error' });
        }
      },
      updateBlog: async (req, res) => {
        console.log("Blog ID",req.params)

        const { blogId } = req.params; // Get blog ID from URL parameters
        const { description, title, tags, metaTitle, metaDescription, metaSchema, category } = req.body;

        console.log('Authenticated User:', req.user);
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            }
            const blog = await Blog.findById(blogId);
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            // Check if the logged-in user is the author of the blog
            if (blog.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Forbidden: You are not the author of this blog' });
            }

            // Update the blog fields
            blog.description = description || blog.description;
            blog.title = title || blog.title;
            blog.tags = tags || blog.tags;
            blog.metaTitle = metaTitle || blog.metaTitle;
            blog.metaDescription = metaDescription || blog.metaDescription;
            blog.metaSchema = metaSchema || blog.metaSchema;
            blog.category = category || blog.category;

            // Save the updated blog
            await blog.save();

            // Respond with success message and the updated blog data
            res.status(200).json({
                message: 'Blog updated successfully',
                blog: blog
            });
        } catch (err) {
            console.error('Error updating blog:', err);
            res.status(500).json({ message: 'Server error' });
        }
      },
    deleteBlog: async (req, res) => {
      const { blogId } = req.params; // Get blog ID from URL parameters
  
      try {
        console.log('Authenticated User:', req.user);
  
        if (!req.user || !req.user._id) {
          return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
        }
  
        const blog = await Blog.findById(blogId);
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
  
        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Forbidden: You are not the author of this blog' });
        }
  
        // Delete the blog
        await Blog.deleteOne({ _id: blogId });
  
        // Respond with success message
        res.status(200).json({
          message: 'Blog deleted successfully'
        });
      } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).json({ message: 'Server error' });
      }
     },
    getAllBlogs: async (req, res) => {
      try {
        // Fetch all blogs
        const blogs = await Blog.find().populate('author', 'fullname email'); // You can populate author details
  
        // Check if blogs are found
        if (!blogs || blogs.length === 0) {
          return res.status(404).json({ message: 'No blogs found' });
        }
  
        // Respond with the list of blogs
        res.status(200).json({
          message: 'Blogs fetched successfully',
          blogs: blogs
        });
      } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
    getBlogById: async (req, res) => {
      const { blogId } = req.params; // Get blog ID from URL parameters
  
      try {
        // Fetch the blog by ID and populate the author details
        const blog = await Blog.findById(blogId).populate('author', 'fullname email');
  
        // Check if the blog exists
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
  
        // Respond with the blog data
        res.status(200).json({
          message: 'Blog fetched successfully',
          blog: blog
        });
      } catch (err) {
        console.error('Error fetching blog by ID:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
    likeBlog : async (req, res) => {
      const { blogId } = req.params;
      const userId = req.user._id;
    
      try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        if (blog.likedBy.includes(userId)) {
          blog.likes -= 1;
          blog.likedBy = blog.likedBy.filter(user => user.toString() !== userId.toString());
        } else {
          // If not, add the user to likedBy array and increment likes
          blog.likes += 1;
          blog.likedBy.push(userId);
    
          // If the user has already disliked, remove the dislike and decrement dislikes
          if (blog.dislikedBy.includes(userId)) {
            blog.dislikes -= 1;
            blog.dislikedBy = blog.dislikedBy.filter(user => user.toString() !== userId.toString());
          }
        }
    
        // Save the updated blog
        await blog.save();
    
        // Return the updated blog
        res.status(200).json({
          message: 'Blog like status updated successfully',
          
        });
      } catch (err) {
        console.error('Error liking the blog:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
     dislikeBlog : async (req, res) => {
      const { blogId } = req.params;
      const userId = req.user._id; // Assuming you have user authentication, and you can access the user ID
    
      try {
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        // Check if the user has already disliked the blog
        if (blog.dislikedBy.includes(userId)) {
          // If user already disliked, remove the dislike and decrement dislikes
          blog.dislikes -= 1;
          blog.dislikedBy = blog.dislikedBy.filter(user => user.toString() !== userId.toString());
        } else {
          // If not, add the user to dislikedBy array and increment dislikes
          blog.dislikes += 1;
          blog.dislikedBy.push(userId);
    
          // If the user has already liked, remove the like and decrement likes
          if (blog.likedBy.includes(userId)) {
            blog.likes -= 1;
            blog.likedBy = blog.likedBy.filter(user => user.toString() !== userId.toString());
          }
        }
    
        // Save the updated blog
        await blog.save();
    
        // Return the updated blog
        res.status(200).json({
          message: 'Blog disliked successfully',
          
        });
      } catch (err) {
        console.error('Error disliking the blog:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
    searchBlogByTitle: async (req, res) => { 
      const { searchQuery } = req.query; // Get the search query from the request
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 blogs per page if not provided

  try {
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Perform a case-insensitive partial match using regex
    const blogs = await Blog.find({
      title: { $regex: searchQuery, $options: 'i' } // 'i' for case-insensitive matching
    })
      .skip((page - 1) * limit) // Skip the blogs for the previous pages
      .limit(limit); // Limit the number of blogs per page

    const totalBlogs = await Blog.countDocuments({
      title: { $regex: searchQuery, $options: 'i' }
    }); // Get the total number of blogs matching the search query

    const totalPages = Math.ceil(totalBlogs / limit); // Calculate total pages

    if (blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found matching the search query' });
    }

    res.status(200).json({
      message: 'Blogs found',
      blogs: blogs,
      pagination: {
        totalBlogs: totalBlogs,
        totalPages: totalPages,
        currentPage: page,
        blogsPerPage: limit
      }
    });
  } catch (err) {
    console.error('Error searching blogs:', err);
    res.status(500).json({ message: 'Server error' });
  }
    },
    

  // Comment
    addCommentByBlogId: async (req, res) => {
  const { userComment } = req.body; // Extract the user comment from the request body
  const { blogId } = req.params; // Extract the blogId from route parameters
  const userId = req.user._id; // Extract the authenticated user's ID from `req.user`

  try {
    // Find the blog to add the comment to
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = {
      user: userId,
      username: req.user.fullname, 
      userComment: userComment,
      userEmail: req.user.email 
    };

    blog.comments.push(newComment); 
    await blog.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
    }, 
    updateCommentByBlogId: async (req, res) => {
  const { commentId, userComment } = req.body; 
  const { blogId } = req.params; 
  const userId = req.user._id; 

  try {
    // Find the blog to update the comment in
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Find the comment to update
    const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId && comment.user.toString() === userId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found or you do not have permission to edit this comment' });
    }

    // Update the comment
    blog.comments[commentIndex].userComment = userComment;
    blog.comments[commentIndex].updatedAt = Date.now(); // Update the timestamp for the update

    await blog.save();

    res.status(200).json({
      message: 'Comment updated successfully',
      updatedComment: blog.comments[commentIndex]
    });
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
    },
    deleteCommentByBlogId: async (req, res) => {
      const { commentId } = req.body; // Extract the comment ID to be deleted
      const { blogId } = req.params; // Extract the blogId from route parameters
      const userId = req.user._id; // Extract the authenticated user's ID from `req.user`
    
      try {
        // Find the blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        // Find the comment index to delete
        const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId && comment.user.toString() === userId);
    
        if (commentIndex === -1) {
          return res.status(404).json({ message: 'Comment not found or you do not have permission to delete this comment' });
        }
    
        // Remove the comment from the blog's comments array
        blog.comments.splice(commentIndex, 1); // This removes the comment at the specified index
    
        // Save the updated blog document
        await blog.save();
    
        res.status(200).json({
          message: 'Comment deleted successfully',
          deletedCommentId: commentId
        });
      } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
    getAllCommentsByBlogId: async (req, res) => {
      const { blogId } = req.params; // Extract the blogId from route parameters
    
      try {
        // Find the blog with the given blogId
        const blog = await Blog.findById(blogId).populate('comments');
       
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        // Return all the comments associated with the blog
        res.status(200).json({
          message: 'Comments fetched successfully',
          comments: blog.comments
        });
      } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
    getCommentById : async (req, res) => {
      const { commentId } = req.body;  // Extract commentId from request body
      const { blogId } = req.params;   // Extract blogId from route parameters
      
      console.log('Received blogId:', blogId); // Log blogId to check if it's correct
    
      try {
        // Find the blog by its blogId
        const blog = await Blog.findById(blogId);
        
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        // Find the comment by its commentId from the blog's comments array
        const comment = blog.comments.id(commentId);  // This will return the comment from the embedded comments array
        
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
    
        // Return the found comment
        res.status(200).json({
          message: 'Comment fetched successfully',
          comment: comment
        });
      } catch (err) {
        console.error('Error fetching comment:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
     likeComment : async (req, res) => {
      const { blogId, commentId } = req.params;
      const userId = req.user._id; // Get the user ID from the authenticated user
    
      try {
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        // Find the comment by its ID in the blog
        const comment = blog.comments.id(commentId);
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
    
        // Check if the user has already liked the comment
        if (comment.commentLikedBy.includes(userId)) {
          // If the user has already liked, remove the like and decrement the like count
          comment.commentLikes -= 1;
          comment.commentLikedBy = comment.commentLikedBy.filter(user => user.toString() !== userId.toString());
        } else {
          // If the user has not liked, add the user to the likedBy array and increment the like count
          comment.commentLikes += 1;
          comment.commentLikedBy.push(userId);
    
          // If the user has previously disliked, remove the dislike and decrement the dislike count
          if (comment.commentDislikedBy.includes(userId)) {
            comment.commentDislikes -= 1;
            comment.commentDislikedBy = comment.commentDislikedBy.filter(user => user.toString() !== userId.toString());
          }
        }
    
        // Save the updated blog and comment
        await blog.save();
    
        // Return the updated comment with like and dislike counts
        res.status(200).json({
          message: 'Comment like status updated successfully',
         
        });
      } catch (err) {
        console.error('Error liking the comment:', err);
        res.status(500).json({ message: 'Server error' });
      }
    },
     dislikeComment : async (req, res) => {
      const { blogId, commentId } = req.params;
      const userId = req.user._id; // Get the user ID from the authenticated user
    
      try {
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        // Find the comment by its ID in the blog
        const comment = blog.comments.id(commentId);
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
    
        // Check if the user has already disliked the comment
        if (comment.commentDislikedBy.includes(userId)) {
          // If the user has already disliked, remove the dislike and decrement the dislike count
          comment.commentDislikes -= 1;
          comment.commentDislikedBy = comment.commentDislikedBy.filter(user => user.toString() !== userId.toString());
        } else {
          // If the user has not disliked, add the user to the dislikedBy array and increment the dislike count
          comment.commentDislikes += 1;
          comment.commentDislikedBy.push(userId);
    
          // If the user has previously liked, remove the like and decrement the like count
          if (comment.commentLikedBy.includes(userId)) {
            comment.commentLikes -= 1;
            comment.commentLikedBy = comment.commentLikedBy.filter(user => user.toString() !== userId.toString());
          }
        }
    
        // Save the updated blog and comment
        await blog.save();
    
        res.status(200).json({
          message: 'Comment dislike status updated successfully',
         
        });
      } catch (err) {
        console.error('Error disliking the comment:', err);
        res.status(500).json({ message: 'Server error' });
      }
    }
    
    
};

module.exports = blogController; 
