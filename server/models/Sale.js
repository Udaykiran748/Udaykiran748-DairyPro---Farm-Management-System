const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customer:     { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date:         { type: Date, required: true, default: Date.now },
  quantity:     { type: Number, required: true },
  ratePerLitre: { type: Number, required: true },
  totalAmount:  { type: Number, required: true },
  paidAmount:   { type: Number, default: 0 },
  pendingAmount:{ type: Number, default: 0 },
  paymentMode:  { type: String, enum: ['Cash', 'Online', 'Credit'], default: 'Cash' },
  paymentStatus:{ type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
  invoiceNo:    { type: String },
  notes:        { type: String },
  recordedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
