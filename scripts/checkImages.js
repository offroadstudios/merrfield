const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function checkImages() {
  try {
    console.log('Checking vehicle images in database...');
    
    const vehicles = await VehicleModel.find({ status: 'available' }).limit(10);
    
    console.log(`Found ${vehicles.length} vehicles:`);
    vehicles.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.title}`);
      console.log(`   Image: ${vehicle.imagePath}`);
      console.log(`   Brand: ${vehicle.brand}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error checking images:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkImages();
