// File: models/Guideline.js
const mongoose = require('mongoose');

const GuidelineSchema = new mongoose.Schema({
    speaker: { type: String },
    poster: { type: String },
    chair: { type: String },
    virtual: { type: String },
});

module.exports = mongoose.model('Guideline', GuidelineSchema);
