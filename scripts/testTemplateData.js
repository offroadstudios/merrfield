const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');
const VehicleSyncService = require('../utils/vehicleSyncService');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function testTemplateData() {
  try {
    console.log('=== TESTING TEMPLATE DATA ===');
    
    const vehicleSyncService = new VehicleSyncService();
    const vehicles = await vehicleSyncService.getAllVehicles(3, 0);
    
    console.log(`Retrieved ${vehicles.length} vehicles for template`);
    
    vehicles.forEach((vehicle, index) => {
      console.log(`\n${index + 1}. ${vehicle.title}`);
      console.log(`   _id: ${vehicle._id}`);
      console.log(`   imagePath: ${vehicle.imagePath}`);
      console.log(`   images array exists: ${!!vehicle.images}`);
      console.log(`   images length: ${vehicle.images ? vehicle.images.length : 'undefined'}`);
      
      if (vehicle.images && vehicle.images.length > 0) {
        console.log('   First image:');
        console.log(`     URL: ${vehicle.images[0].url}`);
        console.log(`     Category: ${vehicle.images[0].category}`);
        console.log(`     Label: ${vehicle.images[0].label}`);
        console.log(`     isThumbnail: ${vehicle.images[0].isThumbnail}`);
      }
    });
    
  } catch (error) {
    console.error('Error testing template data:', error);
  } finally {
    mongoose.disconnect();
  }
}

testTemplateData();
