const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  userComment: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  commentLikes: {
    type: Number,
    default: 0
  },
  commentDislikes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User', // Reference the User model to establish the relationship
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  metaTitle: {
    type: String,
    required: true
  },
  metaDescription: {
    type: String,
    required: true
  },
  metaSchema: {
    type: Object,
    required: true
  },
  comments: [commentSchema],
  category: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
});

// Create a model from the schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
