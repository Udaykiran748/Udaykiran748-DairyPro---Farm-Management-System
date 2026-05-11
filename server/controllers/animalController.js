const Animal = require('../models/Animal');

exports.getAnimals = async (req, res) => {
  try {
    const { type, healthStatus, search } = req.query;
    let query = {};
    if (type) query.type = type;
    if (healthStatus) query.healthStatus = healthStatus;
    if (search) query.name = { $regex: search, $options: 'i' };
    const animals = await Animal.find(query).populate('addedBy', 'name').sort('-createdAt');
    res.json({ success: true, count: animals.length, data: animals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).populate('addedBy', 'name');
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, data: animal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAnimal = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    if (req.file) req.body.image = req.file.path;
    const animal = await Animal.create(req.body);
    res.status(201).json({ success: true, data: animal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    if (req.file) req.body.image = req.file.path;
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, data: animal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    await animal.deleteOne();
    res.json({ success: true, message: 'Animal deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnimalStats = async (req, res) => {
  try {
    const total = await Animal.countDocuments();
    const cows = await Animal.countDocuments({ type: 'Cow' });
    const buffaloes = await Animal.countDocuments({ type: 'Buffalo' });
    const pregnant = await Animal.countDocuments({ isPregnant: true });
    const sick = await Animal.countDocuments({ healthStatus: { $in: ['Poor', 'Sick'] } });
    res.json({ success: true, data: { total, cows, buffaloes, pregnant, sick } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
