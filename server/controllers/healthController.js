const { HealthRecord, Animal, User } = require('../models');
const { Op } = require('sequelize');

exports.getHealthRecords = async (req, res) => {
  try {
    const { animalId, type } = req.query;
    let query = {};
    if (animalId) query.animalIdRef = animalId;
    if (type) query.type = type;
    const records = await HealthRecord.findAll({
      where: query,
      include: [
        { model: Animal, as: 'animal', attributes: ['name', 'animalId', 'type'] },
        { model: User, as: 'recordedByUser', attributes: ['name'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createHealthRecord = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    if (req.body.animal) {
      req.body.animalIdRef = req.body.animal;
    }
    const record = await HealthRecord.create(req.body);
    
    if (req.body.type === 'Treatment' || req.body.type === 'Surgery') {
      await Animal.update({ healthStatus: 'Sick' }, { where: { id: req.body.animalIdRef } });
    }
    
    const recordWithAnimal = await HealthRecord.findByPk(record.id, {
      include: [{ model: Animal, as: 'animal', attributes: ['name', 'animalId'] }]
    });
    res.status(201).json({ success: true, data: recordWithAnimal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    await record.update(req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByPk(req.params.id);
    if (record) {
      await record.destroy();
    }
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUpcomingVaccinations = async (req, res) => {
  try {
    const upcoming = await HealthRecord.findAll({
      where: {
        nextDueDate: {
          [Op.gte]: new Date(),
          [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        type: 'Vaccination'
      },
      include: [{ model: Animal, as: 'animal', attributes: ['name', 'animalId'] }],
      order: [['nextDueDate', 'ASC']]
    });
    res.json({ success: true, data: upcoming });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
