const Listing = require('../../models/Listing');

const listingController = {
  // Get all listings
  getAllListings: async (req, res) => {
    try {
      const listings = await Listing.find();
      res.status(200).json(listings);
    } catch (err) {
      console.error('Error fetching listings:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get featured listings
  getFeaturedListings: async (req, res) => {
    try {
      const featuredListings = await Listing.find({ isFeature: true }).populate('businessType');
      res.status(200).json(featuredListings);
    } catch (err) {
      console.error('Error fetching featured listings:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get listing by ID
  getListingById: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id).populate('businessType');
      
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      
      res.status(200).json(listing);
    } catch (err) {
      console.error('Error fetching listing by ID:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Toggle isFeature status
  toggleFeature: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      
      // Toggle the isFeature status
      listing.isFeature = !listing.isFeature;
      await listing.save();
      
      res.status(200).json({ 
        message: `Listing ${listing.isFeature ? 'marked as featured' : 'unmarked as featured'}`,
        isFeature: listing.isFeature
      });
    } catch (err) {
      console.error('Error toggling feature status:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createListing: async (req, res) => {
    try {
      // Parse fields
      const { title, description, highlights, phone, website, address, businessName } = req.body;
      console.log(req.body);
      console.log(req.files);
      // Parse amenities and dealOptions (sent as JSON strings)
      let amenities = [];
      let dealOptions = [];
      try {
        amenities = JSON.parse(req.body.amenities || '[]');
      } catch (e) {
        amenities = [];
      }
      try {
        dealOptions = JSON.parse(req.body.dealOptions || '[]');
      } catch (e) {
        dealOptions = [];
      }
      // Parse meta fields
      const metaTitle = req.body.metaTitle;
      const metaDescription = req.body.metaDescription;
      let metaSchema = [];
      try {
        metaSchema = JSON.parse(req.body.metaSchema || '[]');
      } catch (e) {
        metaSchema = [];
      }
      // Get uploaded photo filenames with complete path
      const photos = (req.files || []).map(f => {
        // Store the complete URL path for easier frontend access
        return `/uploads/photos/${f.filename}`;
      });
      // Parse badge toggles as booleans
      const showBestRated = req.body.showBestRated === 'true' || req.body.showBestRated === true;
      const showBought = req.body.showBought === 'true' || req.body.showBought === true;
      const showSellingFast = req.body.showSellingFast === 'true' || req.body.showSellingFast === true;
      // Parse sale dates
      const startSaleDate = req.body.startSaleDate ? new Date(req.body.startSaleDate) : undefined;
      const endSaleDate = req.body.endSaleDate ? new Date(req.body.endSaleDate) : undefined;
      // Parse promo fields
      const promoCode = req.body.promoCode || undefined;
      const promoDiscount = req.body.promoDiscount ? Number(req.body.promoDiscount) : undefined;
      const promoValidUntil = req.body.promoValidUntil ? new Date(req.body.promoValidUntil) : undefined;
      // Parse businessType
      const businessType = req.body.businessType || "";
      // Create and save listing
      const listing = new Listing({
        title,
        description,
        highlights,
        amenities,
        dealOptions,
        photos,
        phone,
        website,
        address,
        businessName,
        businessType,
        metaTitle,
        metaDescription,
        metaSchema,
        showBestRated,
        showBought,
        showSellingFast,
        startSaleDate,
        endSaleDate,
        promoCode,
        promoDiscount,
        promoValidUntil
      });
      await listing.save();
      res.status(201).json({ message: 'Listing created successfully', listing });
    } catch (err) {
      console.error('Error creating listing:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  // Update listing by ID
  updateListing: async (req, res) => {
    try {
      const { id } = req.params;
      // Parse fields
      const { title, description, highlights, phone, website, address, businessName } = req.body;
console.log(req.body);
      // Parse amenities and dealOptions (sent as JSON strings)
      let amenities = [];
      let dealOptions = [];
      try {
        amenities = JSON.parse(req.body.amenities || '[]');
      } catch (e) {
        amenities = [];
      }
      try {
        dealOptions = JSON.parse(req.body.dealOptions || '[]');
      } catch (e) {
        dealOptions = [];
      }

      // Parse meta fields
      const metaTitle = req.body.metaTitle;
      const metaDescription = req.body.metaDescription;
      let metaSchema = [];
      try {
        metaSchema = JSON.parse(req.body.metaSchema || '[]');
      } catch (e) {
        metaSchema = [];
      }

      // Parse badge toggles as booleans
      const showBestRated = req.body.showBestRated === 'true' || req.body.showBestRated === true;
      const showBought = req.body.showBought === 'true' || req.body.showBought === true;
      const showSellingFast = req.body.showSellingFast === 'true' || req.body.showSellingFast === true;
      
      // Parse sale dates
      const startSaleDate = req.body.startSaleDate ? new Date(req.body.startSaleDate) : undefined;
      const endSaleDate = req.body.endSaleDate ? new Date(req.body.endSaleDate) : undefined;
      
      // Parse promo fields
      const promoCode = req.body.promoCode || undefined;
      const promoDiscount = req.body.promoDiscount ? Number(req.body.promoDiscount) : undefined;
      const promoType = req.body.promoType || 'percent';
      const promoValidUntil = req.body.promoValidUntil ? new Date(req.body.promoValidUntil) : undefined;

      // Find the listing
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Update fields
      listing.title = title;
      listing.description = description;
      listing.highlights = highlights;
      listing.amenities = amenities;
      listing.dealOptions = dealOptions;
      listing.phone = phone;
      listing.website = website;
      listing.address = address;
      listing.businessName = businessName;
      // Ensure businessType is set as an ObjectId (ID from frontend)
      if (req.body.businessType) {
        listing.businessType = req.body.businessType;
      }
      listing.metaTitle = metaTitle;
      listing.metaDescription = metaDescription;
      listing.metaSchema = metaSchema;
      
      // Update badge toggles
      listing.showBestRated = showBestRated;
      listing.showBought = showBought;
      listing.showSellingFast = showSellingFast;
      
      // Update sale period
      listing.startSaleDate = startSaleDate;
      listing.endSaleDate = endSaleDate;
      
      // Update promo fields
      listing.promoCode = promoCode;
      listing.promoDiscount = promoDiscount;
      listing.promoType = promoType;
      listing.promoValidUntil = promoValidUntil;

      // Handle removing photos
      let photosToRemove = [];
      if (req.body.photosToRemove) {
        try {
          photosToRemove = JSON.parse(req.body.photosToRemove);
        } catch (e) {
          photosToRemove = [];
        }
      }
      if (Array.isArray(photosToRemove) && photosToRemove.length > 0) {
        listing.photos = listing.photos.filter((_, idx) => !photosToRemove.includes(idx));
      }

      // Handle new photo uploads
      if (req.files && req.files.length > 0) {
        const newPhotoPaths = req.files.map(f => `/uploads/photos/${f.filename}`);
        listing.photos = [...listing.photos, ...newPhotoPaths];
      }

      await listing.save();
      res.status(200).json({ message: 'Listing updated successfully', listing });
    } catch (err) {
      console.error('Error updating listing:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Add a review to a listing
  addReviewToListing: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        flexibility,
        qualityService,
        valueOfMoney,
        cleanliness,
        reviewText,
        photoUrls = []
      } = req.body;
      // Handle uploaded files for review images
      let uploadedPhotoUrls = [];
      if (req.files && req.files.length > 0) {
        uploadedPhotoUrls = req.files.map(f => `/uploads/photos/${f.filename}`);
      }
      // Merge URLs from body and uploaded files
      const allPhotoUrls = Array.isArray(photoUrls)
        ? [...photoUrls, ...uploadedPhotoUrls]
        : uploadedPhotoUrls;

      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      const review = {
        name,
        email,
        flexibility,
        qualityService,
        valueOfMoney,
        cleanliness,
        reviewText,
        photoUrls: allPhotoUrls,
        createdAt: new Date()
      };

      if (!listing.reviews) listing.reviews = [];
      listing.reviews.push(review);
      await listing.save();

      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add review', error: error.message });
    }
  },

  // Delete listing by ID
  deleteListing: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Listing.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (err) {
      console.error('Error deleting listing:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = listingController;