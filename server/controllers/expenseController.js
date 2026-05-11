const Expense = require('../models/Expense');
const moment = require('moment');

exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let query = {};
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const expenses = await Expense.find(query).sort('-date');
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ success: true, count: expenses.length, total, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getExpenseSummary = async (req, res) => {
  try {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    const summary = await Expense.aggregate([
      { $match: { date: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);
    const grandTotal = summary.reduce((sum, s) => sum + s.total, 0);
    res.json({ success: true, data: { summary, grandTotal } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
