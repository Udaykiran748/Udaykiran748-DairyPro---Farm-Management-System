const express = require('express');
const router = express.Router();
const { getProductionReport, getFinancialReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/production', protect, getProductionReport);
router.get('/financial', protect, getFinancialReport);
module.exports = router;
