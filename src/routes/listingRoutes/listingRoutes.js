const express = require('express');
const router = express.Router();
const listingController = require('../../controllers/listingController/listingController');
const verifyToken = require('../../middleware/authMiddleware'); 
const upload = require('../../middleware/multerConfig');


router.post('/create', upload.array('photos', 20), listingController.createListing);



router.get('/getAll/listings', listingController.getAllListings);

// Get featured listings
router.get('/getFeaturedListings', listingController.getFeaturedListings);

// Get listing by ID
router.get('/:id', listingController.getListingById);

// Toggle isFeature status
router.patch('/toggle-feature/:id', listingController.toggleFeature);

module.exports = router;
