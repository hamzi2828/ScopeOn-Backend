const express = require('express');
const router = express.Router();
const businessTypeController = require('../controllers/businessTypeController');

// Create
router.post('/', businessTypeController.createBusinessType);
// Read all
router.get('/', businessTypeController.getBusinessTypes);
// Update
router.put('/:id', businessTypeController.updateBusinessType);
// Delete
router.delete('/:id', businessTypeController.deleteBusinessType);

module.exports = router;
