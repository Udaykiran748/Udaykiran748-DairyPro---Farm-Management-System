const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const moment = require('moment');

exports.getSales = async (req, res) => {
  try {
    const { startDate, endDate, customerId } = req.query;
    let query = {};
    if (customerId) query.customer = customerId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const sales = await Sale.find(query).populate('customer', 'name type phone').populate('recordedBy', 'name').sort('-date');
    res.json({ success: true, count: sales.length, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    req.body.totalAmount = req.body.quantity * req.body.ratePerLitre;
    req.body.pendingAmount = req.body.totalAmount - (req.body.paidAmount || 0);
    req.body.paymentStatus = req.body.pendingAmount === 0 ? 'Paid' : req.body.paidAmount > 0 ? 'Partial' : 'Pending';
    req.body.invoiceNo = 'INV-' + Date.now();
    const sale = await Sale.create(req.body);
    if (req.body.pendingAmount > 0) {
      await Customer.findByIdAndUpdate(req.body.customer, { $inc: { pendingAmount: req.body.pendingAmount } });
    }
    await sale.populate('customer', 'name phone');
    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlySalesSummary = async (req, res) => {
  try {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    const result = await Sale.aggregate([
      { $match: { date: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' }, totalQuantity: { $sum: '$quantity' }, totalPaid: { $sum: '$paidAmount' }, totalPending: { $sum: '$pendingAmount' } } }
    ]);
    res.json({ success: true, data: result[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
