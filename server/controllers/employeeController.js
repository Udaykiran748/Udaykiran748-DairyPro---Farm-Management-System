const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).sort('name');
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
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.markAttendance = async (req, res) => {
  try {
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
    if (employeeId) query.employee = employeeId;
    const attendance = await Attendance.find(query).populate('employee', 'name employeeId').sort('-date');
    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
