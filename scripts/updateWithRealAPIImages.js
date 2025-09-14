const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');
const AutotraderAPI = require('../utils/autotraderAPI');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function updateWithRealAPIImages() {
  try {
    console.log('Updating vehicles with REAL API images...');
    
    const api = new AutotraderAPI();
    await api.authenticate();
    console.log('Authenticated successfully');
    
    const response = await api.getVehicles();
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    // Clear all existing vehicles first
    await VehicleModel.deleteMany({});
    console.log('Cleared existing vehicles from database');
    
    // Add all vehicles with real API images
    for (let i = 0; i < response.vehicles.length; i++) {
      const vehicle = response.vehicles[i];
      const transformed = api.transformVehicleData(vehicle);
      
      // Create new vehicle with real API data
      const newVehicle = new VehicleModel(transformed);
      await newVehicle.save();
      
      console.log(`${i + 1}. Added ${transformed.title} with real API image: ${transformed.imagePath}`);
    }
    
    console.log('All vehicles updated with REAL API images!');
  } catch (error) {
    console.error('Error updating vehicles:', error);
  } finally {
    mongoose.disconnect();
  }
}

updateWithRealAPIImages();
