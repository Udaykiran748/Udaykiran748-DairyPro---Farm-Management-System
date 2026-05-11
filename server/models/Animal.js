const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  animalId:       { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  type:           { type: String, enum: ['Cow', 'Buffalo'], default: 'Cow' },
  breed:          { type: String, required: true },
  age:            { type: Number, required: true },
  weight:         { type: Number },
  gender:         { type: String, enum: ['Female', 'Male'], default: 'Female' },
  isPregnant:     { type: Boolean, default: false },
  pregnancyDate:  { type: Date },
  milkCapacity:   { type: Number, default: 0 },
  purchaseDate:   { type: Date },
  purchasePrice:  { type: Number },
  healthStatus:   { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Sick'], default: 'Good' },
  image:          { type: String, default: '' },
  notes:          { type: String },
  isActive:       { type: Boolean, default: true },
  addedBy:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
