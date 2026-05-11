const express = require('express');
const router = express.Router();
const { getFeedRecords, createFeedRecord, getFeedInventory, updateFeedInventory } = require('../controllers/feedingController');
const { protect } = require('../middleware/auth');

router.get('/inventory', protect, getFeedInventory);
router.put('/inventory/:id', protect, updateFeedInventory);
router.get('/', protect, getFeedRecords);
router.post('/', protect, createFeedRecord);
module.exports = router;
