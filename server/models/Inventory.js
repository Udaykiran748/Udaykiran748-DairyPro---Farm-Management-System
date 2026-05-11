const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName:     { type: String, required: true },
  category:     { type: String, enum: ['Feed', 'Medicine', 'Equipment', 'Tools', 'Other'], required: true },
  quantity:     { type: Number, required: true, default: 0 },
  unit:         { type: String, required: true },
  minQuantity:  { type: Number, default: 5 },
  pricePerUnit: { type: Number },
  supplier:     { type: String },
  expiryDate:   { type: Date },
  location:     { type: String },
  lastUpdated:  { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
