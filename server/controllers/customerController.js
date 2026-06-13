const { Customer } = require('../models');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    await customer.update(req.body);
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.update({ isActive: false });
    }
    res.json({ success: true, message: 'Customer removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
