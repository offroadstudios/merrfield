const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

async function debugVehicles() {
  try {
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db');
    
    const count = await VehicleModel.countDocuments();
    console.log('Total vehicles in database:', count);
    
    const vehicles = await VehicleModel.find().limit(10).select('title brand model bodyType price status');
    console.log('Sample vehicles:');
    vehicles.forEach((v, i) => console.log(`${i+1}. ${v.title} - ${v.brand} ${v.model} (${v.bodyType}) - £${v.price} - Status: ${v.status}`));
    
    const availableCount = await VehicleModel.countDocuments({ status: 'available' });
    console.log('Available vehicles:', availableCount);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

debugVehicles();
