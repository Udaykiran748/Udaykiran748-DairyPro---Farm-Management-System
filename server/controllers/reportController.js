const MilkRecord = require('../models/MilkRecord');
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Animal = require('../models/Animal');
const moment = require('moment');

exports.getProductionReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : moment().startOf('month').toDate();
    const end = endDate ? new Date(endDate) : moment().endOf('month').toDate();
    const data = await MilkRecord.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, totalMilk: { $sum: '$totalMilk' }, morning: { $sum: '$morningMilk' }, evening: { $sum: '$eveningMilk' } } },
      { $sort: { _id: 1 } }
    ]);
    const total = data.reduce((sum, d) => sum + d.totalMilk, 0);
    res.json({ success: true, data, total, period: { start, end } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFinancialReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = moment({ year: year || moment().year(), month: (month || moment().month() + 1) - 1 }).startOf('month');
    const end = moment(start).endOf('month');

    const [salesData, expenseData] = await Promise.all([
      Sale.aggregate([
        { $match: { date: { $gte: start.toDate(), $lte: end.toDate() } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, revenue: { $sum: '$totalAmount' }, qty: { $sum: '$quantity' } } },
        { $sort: { _id: 1 } }
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: start.toDate(), $lte: end.toDate() } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
      ])
    ]);

    const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
    const totalExpenses = expenseData.reduce((s, d) => s + d.total, 0);

    res.json({ success: true, data: { salesData, expenseData, totalRevenue, totalExpenses, profit: totalRevenue - totalExpenses } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
