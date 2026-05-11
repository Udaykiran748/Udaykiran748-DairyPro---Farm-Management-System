const express = require('express');
const router = express.Router();
const { getAnimals, getAnimal, createAnimal, updateAnimal, deleteAnimal, getAnimalStats } = require('../controllers/animalController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getAnimalStats);
router.get('/', protect, getAnimals);
router.get('/:id', protect, getAnimal);
router.post('/', protect, authorize('admin', 'farmer'), createAnimal);
router.put('/:id', protect, authorize('admin', 'farmer'), updateAnimal);
router.delete('/:id', protect, authorize('admin'), deleteAnimal);
module.exports = router;
