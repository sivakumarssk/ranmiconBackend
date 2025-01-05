const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    prices: [
        {
            participationType: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ParticipationType',
                required: true,
            },
            price: { type: Number, default: null },
        },
    ],
    startDate: { type: Date },
    endDate: { type: Date },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Plan', PlanSchema);
