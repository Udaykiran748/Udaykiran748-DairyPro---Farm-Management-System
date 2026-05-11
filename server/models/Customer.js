const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId:     { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  type:           { type: String, enum: ['Retail', 'Wholesale', 'Cooperative'], default: 'Retail' },
  phone:          { type: String, required: true },
  email:          { type: String },
  address:        { type: String },
  dailyQuantity:  { type: Number, default: 0 },
  ratePerLitre:   { type: Number, required: true },
  pendingAmount:  { type: Number, default: 0 },
  isActive:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
