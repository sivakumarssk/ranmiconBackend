const mongoose =require('mongoose')

const RegistrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  organization: String,
  phone: String,
  city: String,
  country: String, 
  billingAddress: String,
  interestedIn : String,
  selectedPlan: mongoose.Schema.Types.ObjectId,
  accommodation: String,
  totalPrice: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Registration',RegistrationSchema)