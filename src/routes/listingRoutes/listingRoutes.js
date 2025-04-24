const express = require('express');
const router = express.Router();
const listingController = require('../../controllers/listingController/listingController');
const verifyToken = require('../../../middleware/authMiddleware'); 


// Listing
router.post('/create', listingController.createListing);




module.exports = router;
