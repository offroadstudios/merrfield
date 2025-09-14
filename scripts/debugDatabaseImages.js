const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function debugDatabaseImages() {
  try {
    console.log('=== DEBUGGING DATABASE IMAGES ===');
    
    const vehicles = await VehicleModel.find({}).limit(5);
    console.log(`Found ${vehicles.length} vehicles in database`);
    
    vehicles.forEach((vehicle, index) => {
      console.log(`\n${index + 1}. ${vehicle.title}`);
      console.log(`   Brand: ${vehicle.brand}, Model: ${vehicle.model}`);
      console.log(`   imagePath: ${vehicle.imagePath}`);
      console.log(`   images array length: ${vehicle.images ? vehicle.images.length : 'undefined'}`);
      
      if (vehicle.images && vehicle.images.length > 0) {
        console.log('   First few images:');
        vehicle.images.slice(0, 3).forEach((img, imgIndex) => {
          console.log(`     ${imgIndex + 1}. ${img.url} (${img.category} - ${img.label})`);
        });
      } else {
        console.log('   No images array or empty');
      }
    });
    
  } catch (error) {
    console.error('Error debugging database images:', error);
  } finally {
    mongoose.disconnect();
  }
}

debugDatabaseImages();
