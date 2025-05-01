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
      const featuredListings = await Listing.find({ isFeature: true });
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
      const listing = await Listing.findById(id);
      
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
      const { title, description, highlights, phone, website } = req.body;
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
      // Get uploaded photo filenames with complete path
      const photos = (req.files || []).map(f => {
        // Store the complete URL path for easier frontend access
        return `/uploads/photos/${f.filename}`;
      });
      // Create and save listing
      const listing = new Listing({
        title,
        description,
        highlights,
        amenities,
        dealOptions,
        photos,
        phone,
        website
      });
      await listing.save();
      res.status(201).json({ message: 'Listing created successfully', listing });
    } catch (err) {
      console.error('Error creating listing:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = listingController;