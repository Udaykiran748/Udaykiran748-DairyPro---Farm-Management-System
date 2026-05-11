const express = require('express');
const router = express.Router();
const { getInventory, createItem, updateItem, deleteItem } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getInventory);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
module.exports = router;
