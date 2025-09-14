const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');
const AutotraderAPI = require('../utils/autotraderAPI');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function debugActualImages() {
  try {
    console.log('=== DEBUGGING ACTUAL IMAGES ===');
    
    // Check what's in the database
    console.log('\n1. Checking database images:');
    const dbVehicles = await VehicleModel.find({}).limit(5);
    dbVehicles.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.title}`);
      console.log(`   Database image: ${vehicle.imagePath}`);
      console.log(`   Make: ${vehicle.make}, Model: ${vehicle.model}`);
      console.log('---');
    });
    
    // Check what the API is actually returning
    console.log('\n2. Checking API response:');
    const api = new AutotraderAPI();
    await api.authenticate();
    const response = await api.getVehicles();
    
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    // Check first 3 vehicles from API
    for (let i = 0; i < Math.min(3, response.vehicles.length); i++) {
      const vehicle = response.vehicles[i];
      const media = vehicle.media || {};
      const images = media.images || [];
      
      console.log(`\nVehicle ${i + 1}: ${vehicle.vehicle?.make} ${vehicle.vehicle?.model}`);
      console.log(`Images count: ${images.length}`);
      
      if (images.length > 0) {
        console.log('Available images:');
        images.forEach((img, imgIndex) => {
          const imageUrl = img.href.replace('{resize}', '800x600');
          const category = img.classificationTags?.[0]?.category || 'Unknown';
          const label = img.classificationTags?.[0]?.label || 'Unknown';
          console.log(`  ${imgIndex + 1}. ${imageUrl} (${category} - ${label})`);
        });
      } else {
        console.log('No images available for this vehicle');
      }
    }
    
  } catch (error) {
    console.error('Error debugging images:', error);
  } finally {
    mongoose.disconnect();
  }
}

debugActualImages();
