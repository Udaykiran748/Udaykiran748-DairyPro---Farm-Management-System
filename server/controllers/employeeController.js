const { Employee, Attendance } = require('../models');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    await emp.update(req.body);
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (emp) {
      await emp.update({ isActive: false });
    }
    res.json({ success: true, message: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    if (req.body.employee) req.body.employeeIdRef = req.body.employee;
    const att = await Attendance.create(req.body);
    res.status(201).json({ success: true, data: att });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    let query = {};
    if (employeeId) query.employeeIdRef = employeeId;
    // can add month and year logic if needed
    const attendance = await Attendance.findAll({
      where: query,
      include: [{ model: Employee, as: 'employee', attributes: ['name', 'employeeId'] }],
      order: [['date', 'DESC']]
    });
    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
