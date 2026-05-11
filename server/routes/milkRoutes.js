const express = require('express');
const router = express.Router();
const { getMilkRecords, addMilkRecord, updateMilkRecord, deleteMilkRecord, getDailyProduction, getMonthlyReport } = require('../controllers/milkController');
const { protect } = require('../middleware/auth');

router.get('/daily', protect, getDailyProduction);
router.get('/monthly', protect, getMonthlyReport);
router.get('/', protect, getMilkRecords);
router.post('/', protect, addMilkRecord);
router.put('/:id', protect, updateMilkRecord);
router.delete('/:id', protect, deleteMilkRecord);
module.exports = router;
