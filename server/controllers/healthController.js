const HealthRecord = require('../models/HealthRecord');
const Animal = require('../models/Animal');

exports.getHealthRecords = async (req, res) => {
  try {
    const { animalId, type } = req.query;
    let query = {};
    if (animalId) query.animal = animalId;
    if (type) query.type = type;
    const records = await HealthRecord.find(query).populate('animal', 'name animalId type').populate('recordedBy', 'name').sort('-date');
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createHealthRecord = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    const record = await HealthRecord.create(req.body);
    if (req.body.type === 'Treatment' || req.body.type === 'Surgery') {
      await Animal.findByIdAndUpdate(req.body.animal, { healthStatus: 'Sick' });
    }
    await record.populate('animal', 'name animalId');
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    await HealthRecord.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUpcomingVaccinations = async (req, res) => {
  try {
    const upcoming = await HealthRecord.find({
      nextDueDate: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      type: 'Vaccination'
    }).populate('animal', 'name animalId').sort('nextDueDate');
    res.json({ success: true, data: upcoming });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
