const express = require('express');
const router = express.Router();
const listingController = require('../../controllers/listingController/listingController');
const verifyToken = require('../../middleware/authMiddleware'); 
const upload = require('../../middleware/multerConfig');


router.post('/create', upload.array('photos', 20), listingController.createListing);



// Update a listing by ID (PATCH)
router.patch('/update/:id', upload.array('photos', 20), listingController.updateListing);

router.get('/getAll/listings', listingController.getAllListings);

// Get featured listings
router.get('/getFeaturedListings', listingController.getFeaturedListings);

// Get listing by ID
router.get('/:id', listingController.getListingById);

// Add a review to a listing
router.post('/:id/reviews', upload.array('photoUrls', 20), listingController.addReviewToListing);

// Toggle isFeature status
router.patch('/toggle-feature/:id', listingController.toggleFeature);

// Delete a listing by ID
router.delete('/:id', listingController.deleteListing);

module.exports = router;
