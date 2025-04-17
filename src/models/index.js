// Export all models to make them easier to import
const User = require('./User');
const Blog = require('./Blog');
const Product = require('./Product');
const Review = require('./Review');
const Role = require('./Role');

module.exports = {
  User,
  Blog,
  Product,
  Review,
  Role
};
