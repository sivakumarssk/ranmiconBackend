const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
  amount: { type: Number, default: null },
  currency: { type: String, default: null },
  stripeSessionId: { type: String, default: null }, // Transaction ID for the session
  stripePaymentIntentId: { type: String, default: null }, // Payment intent ID
});

const AccommodationSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
});

const PaymentDetialsSchema = new mongoose.Schema({
  title: String,
  name: String,
  email: String,
  organization: String,
  phone: String,
  country: String,
  interestedIn: String,
  address: String,
  selectedPlan: {
    planId: String,
    planName: String,
    participantType: String,
    price: Number,
  },
  accommodations: [AccommodationSchema],
  payment: PaymentSchema,
});

module.exports = mongoose.model("PaymentDetials", PaymentDetialsSchema);
