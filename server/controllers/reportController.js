const { MilkRecord, Sale, Expense, Animal, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getProductionReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : moment().startOf('month').toDate();
    const end = endDate ? new Date(endDate) : moment().endOf('month').toDate();
    
    const data = await MilkRecord.findAll({
      where: {
        date: {
          [Op.gte]: start,
          [Op.lte]: end
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), '_id'],
        [sequelize.fn('SUM', sequelize.col('totalMilk')), 'totalMilk'],
        [sequelize.fn('SUM', sequelize.col('morningMilk')), 'morning'],
        [sequelize.fn('SUM', sequelize.col('eveningMilk')), 'evening']
      ],
      group: [sequelize.fn('DATE', sequelize.col('date'))],
      order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']]
    });
    
    const allRecords = await MilkRecord.findAll({
      where: {
        date: {
          [Op.gte]: start,
          [Op.lte]: end
        }
      }
    });
    const total = allRecords.reduce((sum, d) => sum + d.totalMilk, 0);
    
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
      Sale.findAll({
        where: {
          date: {
            [Op.gte]: start.toDate(),
            [Op.lte]: end.toDate()
          }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('date')), '_id'],
          [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
          [sequelize.fn('SUM', sequelize.col('quantity')), 'qty']
        ],
        group: [sequelize.fn('DATE', sequelize.col('date'))],
        order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']]
      }),
      Expense.findAll({
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
        group: ['category']
      })
    ]);

    const allSales = await Sale.findAll({ where: { date: { [Op.gte]: start.toDate(), [Op.lte]: end.toDate() } } });
    const allExpenses = await Expense.findAll({ where: { date: { [Op.gte]: start.toDate(), [Op.lte]: end.toDate() } } });

    const totalRevenue = allSales.reduce((s, d) => s + d.totalAmount, 0);
    const totalExpenses = allExpenses.reduce((s, d) => s + d.amount, 0);

    res.json({ success: true, data: { salesData, expenseData, totalRevenue, totalExpenses, profit: totalRevenue - totalExpenses } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
