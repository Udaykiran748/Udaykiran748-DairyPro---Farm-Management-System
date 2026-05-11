const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date:       { type: Date, required: true },
  status:     { type: String, enum: ['Present', 'Absent', 'Half-day', 'Leave'], required: true },
  checkIn:    { type: String },
  checkOut:   { type: String },
  notes:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
