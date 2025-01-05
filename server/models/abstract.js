const mongoose = require('mongoose');

const AbstractSchema = new mongoose.Schema({
    topics: [],
    title: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    organization: {
        type: String,
    },
    phone: {
        type: String,
    },
    country: {
        type: String,
    },
    interestedIn: {
        type: String,
    },
    session: {
        type: String,
    },
    attachFile: {
        type: String,
    },
});

module.exports = mongoose.model('Abstract', AbstractSchema);
