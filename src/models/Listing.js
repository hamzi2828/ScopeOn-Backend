const mongoose = require('mongoose');

const dealOptionSchema = new mongoose.Schema({
  title: String,
  originalPrice: String,
  discountPercentage: String,
  discountedPrice: String,
  finalPrice: String,
  extraOffer: String,
  finalDiscountedPrice: String,
  codeInfo: String,
  purchaseInfo: String,
  giftIcon: Boolean,
});

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  flexibility: { type: Number, required: true },
  qualityService: { type: Number, required: true },
  valueOfMoney: { type: Number, required: true },
  cleanliness: { type: Number, required: true },
  reviewText: { type: String, required: true },
  photoUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  highlights: { type: String },
  amenities: [{ type: String }],
  dealOptions: [dealOptionSchema],
  photos: [{ type: String }],
  isFeature: { type: Boolean, default: false },
  phone: { type: String },
  website: { type: String },
  reviews: [reviewSchema],
}, { timestamps: true });

// Helper to generate slug from title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-')        // collapse whitespace and replace by -
    .replace(/-+/g, '-');         // collapse dashes
}

// Pre-save hook to set slug
listingSchema.pre('validate', async function(next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title);
    let slug = baseSlug;
    let count = 1;
    // Ensure uniqueness
    while (await this.constructor.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Listing', listingSchema);

