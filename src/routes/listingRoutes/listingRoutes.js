const express = require('express');
const router = express.Router();
const listingController = require('../../controllers/listingController/listingController');
const verifyToken = require('../../middleware/authMiddleware'); 
const upload = require('../../middleware/multerConfig');


router.post('/create', upload.array('photos', 20), listingController.createListing);



router.get('/getAll/listings', listingController.getAllListings);

module.exports = router;
