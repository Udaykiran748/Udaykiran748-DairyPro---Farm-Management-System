const { Inventory } = require('../models');

exports.getInventory = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;
    const items = await Inventory.findAll({
      where: query,
      order: [['itemName', 'ASC']]
    });
    const lowStock = items.filter(i => i.quantity <= i.minQuantity);
    res.json({ success: true, count: items.length, lowStockCount: lowStock.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    req.body.lastUpdated = Date.now();
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    await item.update(req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (item) {
      await item.destroy();
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
