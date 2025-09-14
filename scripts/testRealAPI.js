const AutotraderAPI = require('../utils/autotraderAPI');
const VehicleSyncService = require('../utils/vehicleSyncService');
const mongoose = require('mongoose');

async function testRealAPI() {
  try {
    console.log('Testing Real Autotrader API integration...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Connected to MongoDB');

    // Test API authentication
    const autotraderAPI = new AutotraderAPI();
    console.log('Attempting to authenticate with Autotrader API...');
    console.log('Using sandbox URL:', autotraderAPI.sandboxURL);
    console.log('Key:', autotraderAPI.key);
    console.log('Advertiser ID:', autotraderAPI.advertiserId);
    
    const isAuthenticated = await autotraderAPI.authenticate();
    
    if (!isAuthenticated) {
      console.error('Failed to authenticate with Autotrader API');
      console.log('This might be due to:');
      console.log('1. Incorrect API credentials');
      console.log('2. Wrong endpoint URL');
      console.log('3. API not available');
      console.log('4. Network connectivity issues');
      return;
    }
    
    console.log('Successfully authenticated with Autotrader API');

    // Test fetching vehicles
    try {
      console.log('Attempting to fetch vehicles from API...');
      const apiResponse = await autotraderAPI.getVehicles(5);
      console.log('API Response:', JSON.stringify(apiResponse, null, 2));
      
      if (apiResponse.vehicles && apiResponse.vehicles.length > 0) {
        console.log('Successfully fetched real data from Autotrader API!');
        
        // Sync the real data
        const vehicleSyncService = new VehicleSyncService();
        const syncResult = await vehicleSyncService.syncVehiclesFromAutotrader(5);
        console.log('Sync result:', syncResult);
      } else {
        console.log('No vehicles found in API response');
      }
    } catch (apiError) {
      console.log('API fetch failed:', apiError.message);
      console.log('This might be due to:');
      console.log('1. Wrong vehicle endpoint');
      console.log('2. Missing permissions');
      console.log('3. API rate limiting');
      console.log('4. Sandbox data not available');
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
testRealAPI();
