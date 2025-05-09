const BusinessType = require('../models/BusinessType');

// Create a new business type
exports.createBusinessType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await BusinessType.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Business type already exists' });
    }
    const businessType = new BusinessType({ name, description });
    await businessType.save();
    res.status(201).json({ message: 'Business type created', businessType });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all business types
exports.getBusinessTypes = async (req, res) => {
  try {
    const businessTypes = await BusinessType.find();
    res.json(businessTypes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a business type
exports.updateBusinessType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const businessType = await BusinessType.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!businessType) {
      return res.status(404).json({ message: 'Business type not found' });
    }
    res.json({ message: 'Business type updated', businessType });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a business type
exports.deleteBusinessType = async (req, res) => {
  try {
    const { id } = req.params;
    const businessType = await BusinessType.findByIdAndDelete(id);
    if (!businessType) {
      return res.status(404).json({ message: 'Business type not found' });
    }
    res.json({ message: 'Business type deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
