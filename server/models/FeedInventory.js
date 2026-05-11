const mongoose = require('mongoose');

const feedInventorySchema = new mongoose.Schema({
  feedType:      { type: String, required: true },
  currentStock:  { type: Number, required: true, default: 0 },
  unit:          { type: String, enum: ['kg', 'quintal', 'bag'], default: 'kg' },
  minStock:      { type: Number, default: 50 },
  pricePerUnit:  { type: Number },
  supplier:      { type: String },
  lastRestocked: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('FeedInventory', feedInventorySchema);
