const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  animal:       { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  type:         { type: String, enum: ['Vaccination', 'Treatment', 'Check-up', 'Surgery', 'Deworming'], required: true },
  date:         { type: Date, required: true, default: Date.now },
  description:  { type: String, required: true },
  doctor:       { type: String },
  medicines:    [{ name: String, dose: String, duration: String }],
  cost:         { type: Number, default: 0 },
  nextDueDate:  { type: Date },
  status:       { type: String, enum: ['Completed', 'Ongoing', 'Scheduled'], default: 'Completed' },
  notes:        { type: String },
  recordedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
