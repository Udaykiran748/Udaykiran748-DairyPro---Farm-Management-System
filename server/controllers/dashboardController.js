const { Animal, MilkRecord, Sale, Expense, Employee, HealthRecord, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const monthStart = moment().startOf('month');
    const monthEnd = moment().endOf('month');

    const [totalAnimals, totalEmployees] = await Promise.all([
      Animal.count({ where: { isActive: true } }),
      Employee.count({ where: { isActive: true } })
    ]);

    const todayMilk = await MilkRecord.findAll({
      where: {
        date: {
          [Op.gte]: today.toDate(),
          [Op.lt]: moment(today).endOf('day').toDate()
        }
      }
    });
    const todayMilkTotal = todayMilk.reduce((sum, r) => sum + r.totalMilk, 0);

    const monthSales = await Sale.findAll({
      where: {
        date: {
          [Op.gte]: monthStart.toDate(),
          [Op.lte]: monthEnd.toDate()
        }
      }
    });
    const monthSalesTotal = monthSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const monthSalesQty = monthSales.reduce((sum, s) => sum + s.quantity, 0);

    const monthExpenses = await Expense.findAll({
      where: {
        date: {
          [Op.gte]: monthStart.toDate(),
          [Op.lte]: monthEnd.toDate()
        }
      }
    });
    const monthExpensesTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const upcomingVaccinations = await HealthRecord.count({
      where: {
        nextDueDate: {
          [Op.gte]: new Date(),
          [Op.lte]: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const weeklyMilk = await MilkRecord.findAll({
      where: {
        date: {
          [Op.gte]: moment().subtract(7, 'days').toDate()
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), '_id'],
        [sequelize.fn('SUM', sequelize.col('totalMilk')), 'total']
      ],
      group: [sequelize.fn('DATE', sequelize.col('date'))],
      order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']]
    });

    res.json({
      success: true,
      data: {
        totalAnimals,
        totalEmployees,
        todayMilkProduction: todayMilkTotal,
        monthlyIncome: monthSalesTotal,
        monthlyExpenses: monthExpensesTotal,
        monthlyProfit: monthSalesTotal - monthExpensesTotal,
        upcomingVaccinations,
        weeklyMilkChart: weeklyMilk,
        monthlySalesQty: monthSalesQty
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
