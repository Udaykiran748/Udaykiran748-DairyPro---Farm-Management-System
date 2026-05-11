const Animal = require('../models/Animal');
const MilkRecord = require('../models/MilkRecord');
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Employee = require('../models/Employee');
const HealthRecord = require('../models/HealthRecord');
const moment = require('moment');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const monthStart = moment().startOf('month');
    const monthEnd = moment().endOf('month');

    const [totalAnimals, totalEmployees] = await Promise.all([
      Animal.countDocuments({ isActive: true }),
      Employee.countDocuments({ isActive: true })
    ]);

    const todayMilk = await MilkRecord.aggregate([
      { $match: { date: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() } } },
      { $group: { _id: null, total: { $sum: '$totalMilk' } } }
    ]);

    const monthSales = await Sale.aggregate([
      { $match: { date: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, qty: { $sum: '$quantity' } } }
    ]);

    const monthExpenses = await Expense.aggregate([
      { $match: { date: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const upcomingVaccinations = await HealthRecord.countDocuments({
      nextDueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    const weeklyMilk = await MilkRecord.aggregate([
      { $match: { date: { $gte: moment().subtract(7, 'days').toDate() } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, total: { $sum: '$totalMilk' } } },
      { $sort: { _id: 1 } }
    ]);

    const income = monthSales[0]?.total || 0;
    const expenses = monthExpenses[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalAnimals,
        totalEmployees,
        todayMilkProduction: todayMilk[0]?.total || 0,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        monthlyProfit: income - expenses,
        upcomingVaccinations,
        weeklyMilkChart: weeklyMilk,
        monthlySalesQty: monthSales[0]?.qty || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
