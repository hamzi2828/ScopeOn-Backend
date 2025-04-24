const express = require('express');
const router = express.Router();
const listingController = require('../../controllers/listingController/listingController');
const verifyToken = require('../../middleware/authMiddleware'); 
const upload = require('../../middleware/multerConfig');


router.post('/create', upload.array('photos', 20), listingController.createListing);




module.exports = router;
