const { Sale, Customer, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getSales = async (req, res) => {
  try {
    const { startDate, endDate, customerId } = req.query;
    let query = {};
    if (customerId) query.customerIdRef = customerId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date[Op.gte] = new Date(startDate);
      if (endDate) query.date[Op.lte] = new Date(endDate);
    }
    const sales = await Sale.findAll({
      where: query,
      include: [
        { model: Customer, as: 'customer', attributes: ['name', 'type', 'phone'] },
        { model: User, as: 'recordedByUser', attributes: ['name'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json({ success: true, count: sales.length, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    if (req.body.customer) req.body.customerIdRef = req.body.customer;
    
    req.body.totalAmount = req.body.quantity * req.body.ratePerLitre;
    req.body.pendingAmount = req.body.totalAmount - (req.body.paidAmount || 0);
    req.body.paymentStatus = req.body.pendingAmount === 0 ? 'Paid' : req.body.paidAmount > 0 ? 'Partial' : 'Pending';
    req.body.invoiceNo = 'INV-' + Date.now();
    
    const sale = await Sale.create(req.body);
    
    if (req.body.pendingAmount > 0) {
      await Customer.increment('pendingAmount', {
        by: req.body.pendingAmount,
        where: { id: req.body.customerIdRef }
      });
    }
    
    const saleWithCustomer = await Sale.findByPk(sale.id, {
      include: [{ model: Customer, as: 'customer', attributes: ['name', 'phone'] }]
    });
    
    res.status(201).json({ success: true, data: saleWithCustomer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlySalesSummary = async (req, res) => {
  try {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    
    const result = await Sale.findAll({
      where: {
        date: {
          [Op.gte]: start.toDate(),
          [Op.lte]: end.toDate()
        }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('paidAmount')), 'totalPaid'],
        [sequelize.fn('SUM', sequelize.col('pendingAmount')), 'totalPending']
      ]
    });
    
    res.json({ success: true, data: result[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
