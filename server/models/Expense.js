const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category:   { type: String, enum: ['Feed', 'Medicine', 'Salary', 'Electricity', 'Water', 'Maintenance', 'Equipment', 'Other'], required: true },
  amount:     { type: Number, required: true },
  date:       { type: Date, required: true, default: Date.now },
  description:{ type: String, required: true },
  paidTo:     { type: String },
  paymentMode:{ type: String, enum: ['Cash', 'Online', 'Cheque'], default: 'Cash' },
  receipt:    { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
