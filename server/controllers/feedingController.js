const FeedRecord = require('../models/FeedRecord');
const FeedInventory = require('../models/FeedInventory');

exports.getFeedRecords = async (req, res) => {
  try {
    const records = await FeedRecord.find().populate('animals', 'name animalId').populate('recordedBy', 'name').sort('-date');
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.createFeedRecord = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    const record = await FeedRecord.create(req.body);
    await FeedInventory.findOneAndUpdate({ feedType: req.body.feedType }, { $inc: { currentStock: -req.body.quantity } });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getFeedInventory = async (req, res) => {
  try {
    const inventory = await FeedInventory.find().sort('feedType');
    const lowStock = inventory.filter(i => i.currentStock <= i.minStock);
    res.json({ success: true, data: inventory, lowStockAlerts: lowStock });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.updateFeedInventory = async (req, res) => {
  try {
    const item = await FeedInventory.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
