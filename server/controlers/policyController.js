// File: controllers/PolicyController.js
const Policy = require('../models/policy');

// Create or update a specific field
const createOrUpdateField = async (req, res, fieldName) => {
    try {
        const value = req.body[fieldName];
        if (!value) {
            return res.status(400).json({ message: `${fieldName} is required` });
        }
        
        const policy = await Policy.findOneAndUpdate(
            {},
            { [fieldName]: value },
            { new: true, upsert: true } // Update if exists, insert if not
        );
        res.status(200).json({ message: `${fieldName} updated successfully`, policy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a specific field
const getField = async (req, res, fieldName) => {
    try {
        const policy = await Policy.findOne();
        if (!policy || !policy[fieldName]) {
            return res.status(404).json({ message: `${fieldName} not found` });
        }
        res.status(200).json({ [fieldName]: policy[fieldName] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export functions for each field
module.exports = {
    createPrivacy: (req, res) => createOrUpdateField(req, res, 'privacy'),
    createTermsConditions: (req, res) => createOrUpdateField(req, res, 'termsConditions'),
    createCancellation: (req, res) => createOrUpdateField(req, res, 'cancellation'),
    getPrivacy: (req, res) => getField(req, res, 'privacy'),
    getTermsConditions: (req, res) => getField(req, res, 'termsConditions'),
    getCancellation: (req, res) => getField(req, res, 'cancellation'),
};
