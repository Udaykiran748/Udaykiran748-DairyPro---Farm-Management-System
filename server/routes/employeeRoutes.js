const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee, updateEmployee, deleteEmployee, markAttendance, getAttendance } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/attendance', protect, getAttendance);
router.post('/attendance', protect, markAttendance);
router.get('/', protect, getEmployees);
router.post('/', protect, authorize('admin', 'farmer'), createEmployee);
router.put('/:id', protect, authorize('admin', 'farmer'), updateEmployee);
router.delete('/:id', protect, authorize('admin', 'farmer'), deleteEmployee);
module.exports = router;
