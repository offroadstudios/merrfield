const AutotraderAPI = require('../utils/autotraderAPI');
const VehicleSyncService = require('../utils/vehicleSyncService');
const VehicleModel = require('../models/VehicleModel');
const mongoose = require('mongoose');

async function testSyncOne() {
  try {
    console.log('Testing sync of one vehicle from Autotrader API...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Connected to MongoDB');

    // Test API
    const autotraderAPI = new AutotraderAPI();
    const isAuthenticated = await autotraderAPI.authenticate();
    
    if (!isAuthenticated) {
      console.error('Failed to authenticate with Autotrader API');
      return;
    }
    
    console.log('Successfully authenticated with Autotrader API');

    // Get vehicles from API
    const apiResponse = await autotraderAPI.getVehicles(1);
    console.log('API Response structure:', Object.keys(apiResponse));
    console.log('Vehicles array length:', apiResponse.vehicles?.length || apiResponse.data?.length || 0);
    
    if (apiResponse.vehicles && apiResponse.vehicles.length > 0) {
      console.log('First vehicle from API:', JSON.stringify(apiResponse.vehicles[0], null, 2));
      
      // Transform the vehicle data
      const transformedData = autotraderAPI.transformVehicleData(apiResponse.vehicles[0]);
      console.log('Transformed vehicle data:', JSON.stringify(transformedData, null, 2));
      
      // Save to database
      const vehicle = new VehicleModel(transformedData);
      await vehicle.save();
      console.log('Successfully saved vehicle to database:', transformedData.title);
    } else if (apiResponse.data && apiResponse.data.length > 0) {
      console.log('First vehicle from API (data array):', JSON.stringify(apiResponse.data[0], null, 2));
      
      // Transform the vehicle data
      const transformedData = autotraderAPI.transformVehicleData(apiResponse.data[0]);
      console.log('Transformed vehicle data:', JSON.stringify(transformedData, null, 2));
      
      // Save to database
      const vehicle = new VehicleModel(transformedData);
      await vehicle.save();
      console.log('Successfully saved vehicle to database:', transformedData.title);
    } else {
      console.log('No vehicles found in API response');
    }

    console.log('Test completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testSyncOne();
