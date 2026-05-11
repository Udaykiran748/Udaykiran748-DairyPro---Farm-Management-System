const mongoose = require('mongoose');

const milkRecordSchema = new mongoose.Schema({
  animal:       { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  date:         { type: Date, required: true, default: Date.now },
  morningMilk:  { type: Number, default: 0 },
  eveningMilk:  { type: Number, default: 0 },
  totalMilk:    { type: Number, default: 0 },
  quality:      { type: String, enum: ['A+', 'A', 'B', 'C'], default: 'A' },
  fatContent:   { type: Number },
  notes:        { type: String },
  recordedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

milkRecordSchema.pre('save', function(next) {
  this.totalMilk = this.morningMilk + this.eveningMilk;
  next();
});

module.exports = mongoose.model('MilkRecord', milkRecordSchema);
