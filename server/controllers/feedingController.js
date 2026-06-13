const { FeedRecord, FeedInventory, User } = require('../models');

exports.getFeedRecords = async (req, res) => {
  try {
    const records = await FeedRecord.findAll({
      include: [{ model: User, as: 'recordedByUser', attributes: ['name'] }],
      order: [['date', 'DESC']]
    });
    // If animals need to be fetched, they can be fetched here since they are stored as JSON IDs
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFeedRecord = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    const record = await FeedRecord.create(req.body);
    
    // Decrement stock
    await FeedInventory.decrement('currentStock', {
      by: req.body.quantity,
      where: { feedType: req.body.feedType }
    });
    
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeedInventory = async (req, res) => {
  try {
    const inventory = await FeedInventory.findAll({ order: [['feedType', 'ASC']] });
    const lowStock = inventory.filter(i => i.currentStock <= i.minStock);
    res.json({ success: true, data: inventory, lowStockAlerts: lowStock });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFeedInventory = async (req, res) => {
  try {
    const [item, created] = await FeedInventory.upsert({
      id: req.params.id,
      ...req.body
    });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
