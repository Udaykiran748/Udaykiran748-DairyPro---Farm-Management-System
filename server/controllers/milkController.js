const MilkRecord = require('../models/MilkRecord');
const Animal = require('../models/Animal');
const moment = require('moment');

exports.getMilkRecords = async (req, res) => {
  try {
    const { startDate, endDate, animalId } = req.query;
    let query = {};
    if (animalId) query.animal = animalId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const records = await MilkRecord.find(query).populate('animal', 'name animalId type').populate('recordedBy', 'name').sort('-date');
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addMilkRecord = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    req.body.totalMilk = (req.body.morningMilk || 0) + (req.body.eveningMilk || 0);
    const record = await MilkRecord.create(req.body);
    await record.populate('animal', 'name animalId');
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMilkRecord = async (req, res) => {
  try {
    if (req.body.morningMilk !== undefined || req.body.eveningMilk !== undefined) {
      const existing = await MilkRecord.findById(req.params.id);
      req.body.totalMilk = (req.body.morningMilk ?? existing.morningMilk) + (req.body.eveningMilk ?? existing.eveningMilk);
    }
    const record = await MilkRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMilkRecord = async (req, res) => {
  try {
    await MilkRecord.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDailyProduction = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const records = await MilkRecord.find({ date: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() } }).populate('animal', 'name');
    const total = records.reduce((sum, r) => sum + r.totalMilk, 0);
    res.json({ success: true, data: { records, total, date: today } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const start = moment({ year: year || moment().year(), month: (month || moment().month() + 1) - 1 }).startOf('month');
    const end = moment(start).endOf('month');
    const records = await MilkRecord.aggregate([
      { $match: { date: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, totalMilk: { $sum: '$totalMilk' }, morning: { $sum: '$morningMilk' }, evening: { $sum: '$eveningMilk' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const totalMonthly = records.reduce((sum, r) => sum + r.totalMilk, 0);
    res.json({ success: true, data: { records, totalMonthly } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
