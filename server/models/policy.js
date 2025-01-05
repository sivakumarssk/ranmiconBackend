// File: models/Guideline.js
const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    privacy: { type: String },
    termsConditions: { type: String },
    cancellation: { type: String },
});

module.exports = mongoose.model('Policy', PolicySchema);
