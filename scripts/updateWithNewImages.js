const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');
const AutotraderAPI = require('../utils/autotraderAPI');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function updateWithNewImages() {
  try {
    console.log('Updating vehicles with new image logic...');
    
    const api = new AutotraderAPI();
    await api.authenticate();
    console.log('Authenticated successfully');
    
    const response = await api.getVehicles();
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    // Update each vehicle with the new image logic
    for (let i = 0; i < response.vehicles.length; i++) {
      const vehicle = response.vehicles[i];
      const transformed = api.transformVehicleData(vehicle);
      
      // Find and update the vehicle in database
      const existingVehicle = await VehicleModel.findOne({ 
        autotraderId: transformed.autotraderId || `api-${i}` 
      });
      
      if (existingVehicle) {
        await VehicleModel.findByIdAndUpdate(existingVehicle._id, {
          imagePath: transformed.imagePath,
          title: transformed.title,
          make: transformed.make,
          model: transformed.model,
          bodyType: transformed.bodyType
        });
        
        console.log(`Updated ${transformed.title} with new image: ${transformed.imagePath}`);
      } else {
        // Create new vehicle if not found
        const newVehicle = new VehicleModel(transformed);
        await newVehicle.save();
        console.log(`Created new vehicle: ${transformed.title}`);
      }
    }
    
    console.log('All vehicles updated with new image logic!');
  } catch (error) {
    console.error('Error updating vehicles:', error);
  } finally {
    mongoose.disconnect();
  }
}

updateWithNewImages();
