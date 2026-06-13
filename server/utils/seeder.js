require('dotenv').config()
const db = require('../models')
const bcrypt = require('bcryptjs')

const connectDB = async () => {
  await db.sequelize.authenticate()
  await db.sequelize.sync({ force: true }) // WARNING: this will drop existing tables and recreate them
  console.log('DB connected and synced')
}

const seed = async () => {
  await connectDB()
  const { User, Animal } = db

  const admin = await User.create({
    name: 'Admin User', email: 'admin@farm.com', password: 'admin123', role: 'admin', phone: '9876543210'
  })

  const animals = [
    { animalId:'A001', name:'Lakshmi', type:'Cow', breed:'Holstein', age:4, weight:480, gender:'Female', isPregnant:true, milkCapacity:22, healthStatus:'Good', addedBy: admin.id },
    { animalId:'A002', name:'Ganga', type:'Cow', breed:'Jersey', age:3, weight:360, gender:'Female', isPregnant:false, milkCapacity:18, healthStatus:'Excellent', addedBy: admin.id },
    { animalId:'A003', name:'Nandini', type:'Buffalo', breed:'Murrah', age:5, weight:520, gender:'Female', isPregnant:false, milkCapacity:14, healthStatus:'Good', addedBy: admin.id },
    { animalId:'A004', name:'Kaveri', type:'Cow', breed:'Gir', age:6, weight:400, gender:'Female', isPregnant:true, milkCapacity:12, healthStatus:'Fair', addedBy: admin.id },
    { animalId:'A005', name:'Yamuna', type:'Cow', breed:'Holstein', age:2, weight:340, gender:'Female', isPregnant:false, milkCapacity:20, healthStatus:'Excellent', addedBy: admin.id },
  ]
  await Animal.bulkCreate(animals)

  console.log('✅ Demo data seeded!')
  console.log('📧 Login: admin@farm.com / admin123')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
