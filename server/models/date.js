const mongoose = require('mongoose');

const datesSchema = new mongoose.Schema({
    dates: {
        type: Map,
        of: [
            {
                head: { type: String, required: true },
                date: { type: String, required: true }, // Use Date type if needed
            }
        ],
    },
});

module.exports = mongoose.model('Date', datesSchema);
