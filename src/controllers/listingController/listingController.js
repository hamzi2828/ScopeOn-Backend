const listingController = { 
    createListing: (req, res) => {
        try {
            console.log('Body:', req.body);
            console.log('Files:', req.files);
            res.status(200).json({ message: 'Listing created successfully' });
        } catch (err) {
            console.error('Error creating listing:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = listingController;