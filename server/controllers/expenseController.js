const { Expense, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let query = {};
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date[Op.gte] = new Date(startDate);
      if (endDate) query.date[Op.lte] = new Date(endDate);
    }
    const expenses = await Expense.findAll({
      where: query,
      order: [['date', 'DESC']]
    });
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
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    await expense.update(req.body);
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (expense) {
      await expense.destroy();
    }
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getExpenseSummary = async (req, res) => {
  try {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    const summary = await Expense.findAll({
      where: {
        date: {
          [Op.gte]: start.toDate(),
          [Op.lte]: end.toDate()
        }
      },
      attributes: [
        ['category', '_id'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['category'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
    });
    
    const allExpenses = await Expense.findAll({
      where: {
        date: {
          [Op.gte]: start.toDate(),
          [Op.lte]: end.toDate()
        }
      }
    });
    const grandTotal = allExpenses.reduce((sum, s) => sum + s.amount, 0);
    
    res.json({ success: true, data: { summary, grandTotal } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
