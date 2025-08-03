// scripts/seedInitialData.js

require('dotenv').config();
const mongoose = require('mongoose');

// Import Mongoose models (correct paths/names inside repo)
const Customer = require('../models/CustomerModel');
const ElectricCar = require('../models/ElectricModel.js.bak');
const GasCar = require('../models/GasModel.js.bak');
const Service = require('../models/ServiceModel');
const User = require('../models/UserModel');

// Load raw JSON data
const customerData = require('../db_data/customer.json');
const electricData = require('../db_data/electricmodel.json');
const gasData = require('../db_data/gasmodel.json');
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
    await seedCollection(ElectricCar, electricData, 'ElectricCars');
    await seedCollection(GasCar, gasData, 'GasCars');
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
