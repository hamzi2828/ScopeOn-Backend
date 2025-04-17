const mongoose = require('mongoose');

const ProductOptionSchema = new mongoose.Schema({
  optionName: {
    type: String,
    required: true,
    trim: true
  },
  regularPrice: {
    type: Number,
    required: true
  },
  scopeOnPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  monthlyVoucherCap: {
    type: Number,
    default: 0
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
}, { _id: true }); // Ensure subdocuments have their own _id

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  highlight: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  productOptions: [ProductOptionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
