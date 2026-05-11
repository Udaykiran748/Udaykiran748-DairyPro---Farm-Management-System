const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId:   { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  role:         { type: String, required: true },
  phone:        { type: String, required: true },
  email:        { type: String },
  address:      { type: String },
  salary:       { type: Number, required: true },
  joinDate:     { type: Date, required: true },
  isActive:     { type: Boolean, default: true },
  avatar:       { type: String, default: '' },
  tasks:        [{ task: String, dueDate: Date, status: String }],
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
