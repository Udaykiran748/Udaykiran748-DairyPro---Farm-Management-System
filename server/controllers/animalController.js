const { Animal, User } = require('../models');
const { Op } = require('sequelize');

exports.getAnimals = async (req, res) => {
  try {
    const { type, healthStatus, search } = req.query;
    let query = {};
    if (type) query.type = type;
    if (healthStatus) query.healthStatus = healthStatus;
    if (search) query.name = { [Op.like]: `%${search}%` };
    
    const animals = await Animal.findAll({
      where: query,
      include: [{ model: User, as: 'addedByUser', attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, count: animals.length, data: animals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: [{ model: User, as: 'addedByUser', attributes: ['name'] }]
    });
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, data: animal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAnimal = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    if (req.file) req.body.image = req.file.path;
    const animal = await Animal.create(req.body);
    res.status(201).json({ success: true, data: animal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    if (req.file) req.body.image = req.file.path;
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    
    await animal.update(req.body);
    res.json({ success: true, data: animal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    await animal.destroy();
    res.json({ success: true, message: 'Animal deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnimalStats = async (req, res) => {
  try {
    const total = await Animal.count();
    const cows = await Animal.count({ where: { type: 'Cow' } });
    const buffaloes = await Animal.count({ where: { type: 'Buffalo' } });
    const pregnant = await Animal.count({ where: { isPregnant: true } });
    const sick = await Animal.count({ where: { healthStatus: { [Op.in]: ['Poor', 'Sick'] } } });
    res.json({ success: true, data: { total, cows, buffaloes, pregnant, sick } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
