const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');
const VehicleSyncService = require('../utils/vehicleSyncService');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function testTimestamp() {
  try {
    console.log('=== TESTING TIMESTAMP ===');
    
    const vehicleSyncService = new VehicleSyncService();
    const vehicles = await vehicleSyncService.getAllVehicles(2, 0);
    
    console.log('Timestamp:', Date.now());
    console.log('Vehicles:', vehicles.length);
    
    vehicles.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.title}`);
      console.log(`   imagePath: ${vehicle.imagePath}`);
      console.log(`   images count: ${vehicle.images ? vehicle.images.length : 0}`);
    });
    
  } catch (error) {
    console.error('Error testing timestamp:', error);
  } finally {
    mongoose.disconnect();
  }
}

testTimestamp();
