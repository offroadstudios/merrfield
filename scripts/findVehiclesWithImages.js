const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');
const AutotraderAPI = require('../utils/autotraderAPI');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function findVehiclesWithImages() {
  try {
    console.log('Finding vehicles with images from API...');
    
    const api = new AutotraderAPI();
    await api.authenticate();
    const response = await api.getVehicles();
    
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    // Clear existing vehicles
    await VehicleModel.deleteMany({});
    console.log('Cleared existing vehicles');
    
    let vehiclesWithImages = 0;
    let totalImages = 0;
    
    // Process each vehicle
    for (let i = 0; i < response.vehicles.length; i++) {
      const vehicle = response.vehicles[i];
      const media = vehicle.media || {};
      const images = media.images || [];
      
      if (images.length > 0) {
        vehiclesWithImages++;
        totalImages += images.length;
        
        const transformed = api.transformVehicleData(vehicle);
        const newVehicle = new VehicleModel(transformed);
        await newVehicle.save();
        
        console.log(`${vehiclesWithImages}. ${transformed.title} - ${images.length} images`);
        console.log(`   Images: ${transformed.images.map(img => `${img.category}(${img.label})`).join(', ')}`);
      } else {
        console.log(`Skipping ${vehicle.vehicle?.make} ${vehicle.vehicle?.model} - no images`);
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Vehicles with images: ${vehiclesWithImages}`);
    console.log(`- Total images: ${totalImages}`);
    console.log(`- Average images per vehicle: ${vehiclesWithImages > 0 ? (totalImages / vehiclesWithImages).toFixed(1) : 0}`);
    
  } catch (error) {
    console.error('Error finding vehicles with images:', error);
  } finally {
    mongoose.disconnect();
  }
}

findVehiclesWithImages();
