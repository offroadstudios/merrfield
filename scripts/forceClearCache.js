const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function forceClearCache() {
  try {
    console.log('=== FORCING CACHE CLEAR ===');
    
    // Get all vehicles
    const vehicles = await VehicleModel.find({}).limit(5);
    console.log(`Found ${vehicles.length} vehicles`);
    
    vehicles.forEach((vehicle, index) => {
      console.log(`\n${index + 1}. ${vehicle.title}`);
      console.log(`   ID: ${vehicle._id}`);
      console.log(`   imagePath: ${vehicle.imagePath}`);
      console.log(`   images count: ${vehicle.images ? vehicle.images.length : 0}`);
      
      if (vehicle.images && vehicle.images.length > 0) {
        console.log('   First 3 images:');
        vehicle.images.slice(0, 3).forEach((img, imgIndex) => {
          console.log(`     ${imgIndex + 1}. ${img.url}`);
        });
      }
    });
    
    // Force update all vehicles with a new timestamp
    const timestamp = Date.now();
    await VehicleModel.updateMany({}, { 
      $set: { 
        lastCacheBust: timestamp,
        updatedAt: new Date()
      } 
    });
    
    console.log(`\nUpdated all vehicles with timestamp: ${timestamp}`);
    
  } catch (error) {
    console.error('Error forcing cache clear:', error);
  } finally {
    mongoose.disconnect();
  }
}

forceClearCache();
