// File: controllers/guidelineController.js
const Guideline = require('../models/guideline');

// Create or update a specific field
const createOrUpdateField = async (req, res, fieldName) => {
    try {
        const value = req.body[fieldName];
        if (!value) {
            return res.status(400).json({ message: `${fieldName} is required` });
        }
        
        const guideline = await Guideline.findOneAndUpdate(
            {},
            { [fieldName]: value },
            { new: true, upsert: true } // Update if exists, insert if not
        );
        res.status(200).json({ message: `${fieldName} updated successfully`, guideline });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a specific field
const getField = async (req, res, fieldName) => {
    try {
        const guideline = await Guideline.findOne();
        if (!guideline || !guideline[fieldName]) {
            return res.status(404).json({ message: `${fieldName} not found` });
        }
        res.status(200).json({ [fieldName]: guideline[fieldName] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export functions for each field
module.exports = {
    createSpeaker: (req, res) => createOrUpdateField(req, res, 'speaker'),
    createPoster: (req, res) => createOrUpdateField(req, res, 'poster'),
    createChair: (req, res) => createOrUpdateField(req, res, 'chair'),
    createVirtual: (req, res) => createOrUpdateField(req, res, 'virtual'),
    createAbstract: (req, res) => createOrUpdateField(req, res, 'abstract'),
    createPlans: (req, res) => createOrUpdateField(req, res, 'plans'),
    getSpeaker: (req, res) => getField(req, res, 'speaker'),
    getPoster: (req, res) => getField(req, res, 'poster'),
    getChair: (req, res) => getField(req, res, 'chair'),
    getVirtual: (req, res) => getField(req, res, 'virtual'),
    getAbstract: (req, res) => getField(req, res, 'abstract'),
    getPlans: (req, res) => getField(req, res, 'plans'),
};
