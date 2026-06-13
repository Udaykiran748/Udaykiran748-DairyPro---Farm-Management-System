const { MilkRecord, Animal, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getMilkRecords = async (req, res) => {
  try {
    const { startDate, endDate, animalId } = req.query;
    let query = {};
    if (animalId) query.animalIdRef = animalId; // Assuming association uses animalIdRef
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date[Op.gte] = new Date(startDate);
      if (endDate) query.date[Op.lte] = new Date(endDate);
    }
    const records = await MilkRecord.findAll({
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

exports.addMilkRecord = async (req, res) => {
  try {
    req.body.recordedBy = req.user.id;
    // Map mongoose animal to animalIdRef
    if (req.body.animal) {
      req.body.animalIdRef = req.body.animal;
    }
    req.body.totalMilk = (req.body.morningMilk || 0) + (req.body.eveningMilk || 0);
    const record = await MilkRecord.create(req.body);
    const recordWithAnimal = await MilkRecord.findByPk(record.id, {
      include: [{ model: Animal, as: 'animal', attributes: ['name', 'animalId'] }]
    });
    res.status(201).json({ success: true, data: recordWithAnimal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMilkRecord = async (req, res) => {
  try {
    const record = await MilkRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    
    if (req.body.morningMilk !== undefined || req.body.eveningMilk !== undefined) {
      req.body.totalMilk = (req.body.morningMilk ?? record.morningMilk) + (req.body.eveningMilk ?? record.eveningMilk);
    }
    await record.update(req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMilkRecord = async (req, res) => {
  try {
    const record = await MilkRecord.findByPk(req.params.id);
    if (record) {
      await record.destroy();
    }
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDailyProduction = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const records = await MilkRecord.findAll({
      where: {
        date: {
          [Op.gte]: today.toDate(),
          [Op.lt]: moment(today).endOf('day').toDate()
        }
      },
      include: [{ model: Animal, as: 'animal', attributes: ['name'] }]
    });
    const total = records.reduce((sum, r) => sum + r.totalMilk, 0);
    res.json({ success: true, data: { records, total, date: today } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const start = moment({ year: year || moment().year(), month: (month || moment().month() + 1) - 1 }).startOf('month');
    const end = moment(start).endOf('month');
    
    const records = await MilkRecord.findAll({
      where: {
        date: {
          [Op.gte]: start.toDate(),
          [Op.lte]: end.toDate()
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), '_id'],
        [sequelize.fn('SUM', sequelize.col('totalMilk')), 'totalMilk'],
        [sequelize.fn('SUM', sequelize.col('morningMilk')), 'morning'],
        [sequelize.fn('SUM', sequelize.col('eveningMilk')), 'evening'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('date'))],
      order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']]
    });
    
    // Calculate overall total
    const allRecords = await MilkRecord.findAll({
      where: {
        date: {
          [Op.gte]: start.toDate(),
          [Op.lte]: end.toDate()
        }
      }
    });
    const totalMonthly = allRecords.reduce((sum, r) => sum + r.totalMilk, 0);
    
    res.json({ success: true, data: { records, totalMonthly } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
