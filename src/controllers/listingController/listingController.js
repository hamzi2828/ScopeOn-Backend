const Listing = require('../../models/Listing');

const listingController = {
  createListing: async (req, res) => {
    try {
      // Parse fields
      const { title, description, highlights } = req.body;
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
      // Get uploaded photo filenames
      const photos = (req.files || []).map(f => f.filename);
      // Create and save listing
      const listing = new Listing({
        title,
        description,
        highlights,
        amenities,
        dealOptions,
        photos
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