const express = require('express');
const router = express.Router();
const { getSales, createSale, getMonthlySalesSummary } = require('../controllers/salesController');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, getMonthlySalesSummary);
router.get('/', protect, getSales);
router.post('/', protect, createSale);
module.exports = router;
