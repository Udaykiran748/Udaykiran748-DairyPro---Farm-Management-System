const express = require('express');
const router = express.Router();
const { getHealthRecords, createHealthRecord, updateHealthRecord, deleteHealthRecord, getUpcomingVaccinations } = require('../controllers/healthController');
const { protect } = require('../middleware/auth');

router.get('/vaccinations/upcoming', protect, getUpcomingVaccinations);
router.get('/', protect, getHealthRecords);
router.post('/', protect, createHealthRecord);
router.put('/:id', protect, updateHealthRecord);
router.delete('/:id', protect, deleteHealthRecord);
module.exports = router;
