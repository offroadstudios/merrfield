// scripts/seedInitialData.js

require('dotenv').config();
const mongoose = require('mongoose');

// Import Mongoose models
const Customer = require('../models/CustomerModel');
const HatchbackCar = require('../models/HatchbackModel');
const SUVCar = require('../models/SUVModel');
const SaloonCar = require('../models/SaloonModel');
const Service = require('../models/ServiceModel');
const User = require('../models/UserModel');

// Load raw JSON data
const customerData = require('../db_data/customer.json');
const hatchbackData = require('../db_data/hatchbackmodel.json');
const suvData = require('../db_data/suvmodel.json');
const saloonData = require('../db_data/saloonmodel.json');
const serviceData = require('../db_data/service.json');
const userData = require('../db_data/user.json');

async function seedCollection(Model, data, label) {
  const count = await Model.countDocuments();
  if (count === 0) {
    const cleaned = data.map(doc => {
      const { _id, ...rest } = doc;
      return rest;
    });
    await Model.insertMany(cleaned);
    console.log(`✅ ${label} inserted (${cleaned.length} items)`);
  } else {
    console.log(`ℹ️ ${label} already exists, skipped`);
  }
}

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log('🌱 Connected to DB, starting seeding...');

    await seedCollection(Customer, customerData, 'Customers');
    await seedCollection(HatchbackCar, hatchbackData, 'HatchbackCars');
    await seedCollection(SUVCar, suvData, 'SUVCars');
    await seedCollection(SaloonCar, saloonData, 'SaloonCars');
    await seedCollection(Service, serviceData, 'Services');
    await seedCollection(User, userData, 'Users');

    console.log('\n🎉 All seeding complete.');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedAll();
