// controllers/blogController.js
const Blog = require('../../models/Blog'); // Import the Blog model
const User = require('../../models/User');

const blogController = {
    createBlog : async (req, res) => {
        const { description, title, tags, metaTitle, metaDescription, metaSchema, category } = req.body;
        console.log('Request Body:', req.body);
        console.log('Authenticated User:', req.user.fullname);
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
      
};

module.exports = blogController; 
