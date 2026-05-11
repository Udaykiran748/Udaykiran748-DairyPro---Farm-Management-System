const mongoose = require('mongoose');

const feedScheduleSchema = new mongoose.Schema({
  feedType:     { type: String, required: true },
  quantity:     { type: Number, required: true },
  unit:         { type: String, enum: ['kg', 'g', 'litre'], default: 'kg' },
  time:         { type: String, required: true },
  animals:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }],
  date:         { type: Date, default: Date.now },
  notes:        { type: String },
  recordedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FeedRecord', feedScheduleSchema);
