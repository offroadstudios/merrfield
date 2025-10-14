const AutotraderAPI = require('../utils/autotraderAPI');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/autorizz-db?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function testNotPublishedFilter() {
  try {
    console.log('Testing NOT_PUBLISHED filter...');
    
    const api = new AutotraderAPI();
    await api.authenticate();
    console.log('Authenticated successfully');
    
    const response = await api.getVehicles(1, 20); // Get 20 vehicles per page (API limit)
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    let publishedCount = 0;
    let notPublishedCount = 0;
    let notPublishedVehicles = [];
    
    // Check each vehicle's advertiser advert status
    for (let i = 0; i < response.vehicles.length; i++) {
      const vehicle = response.vehicles[i];
      const advertiserAdvertStatus = vehicle.adverts?.retailAdverts?.advertiserAdvert?.status;
      const registration = vehicle.vehicle?.registration || vehicle.metadata?.stockId;
      
      console.log(`Vehicle ${i + 1}: ${registration} - Advertiser Advert Status: ${advertiserAdvertStatus}`);
      
      if (advertiserAdvertStatus === 'PUBLISHED') {
        publishedCount++;
      } else if (advertiserAdvertStatus === 'NOT_PUBLISHED') {
        notPublishedCount++;
        notPublishedVehicles.push({
          registration: registration,
          make: vehicle.vehicle?.make,
          model: vehicle.vehicle?.model,
          status: advertiserAdvertStatus
        });
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Published vehicles: ${publishedCount}`);
    console.log(`- NOT_PUBLISHED vehicles: ${notPublishedCount}`);
    
    if (notPublishedVehicles.length > 0) {
      console.log(`\nNOT_PUBLISHED vehicles found:`);
      notPublishedVehicles.forEach(vehicle => {
        console.log(`  - ${vehicle.registration}: ${vehicle.make} ${vehicle.model}`);
      });
      
      // Test the transformVehicleData method with a NOT_PUBLISHED vehicle
      console.log(`\nTesting transformVehicleData with NOT_PUBLISHED vehicle...`);
      const notPublishedVehicle = response.vehicles.find(v => 
        v.adverts?.retailAdverts?.advertiserAdvert?.status === 'NOT_PUBLISHED'
      );
      
      if (notPublishedVehicle) {
        const transformed = api.transformVehicleData(notPublishedVehicle);
        if (transformed === null) {
          console.log('✅ SUCCESS: NOT_PUBLISHED vehicle correctly filtered out (returned null)');
        } else {
          console.log('❌ ERROR: NOT_PUBLISHED vehicle was not filtered out');
        }
      }
    } else {
      console.log('\nNo NOT_PUBLISHED vehicles found in current API response.');
      console.log('This means all vehicles in the current batch are published.');
    }
    
  } catch (error) {
    console.error('Error testing NOT_PUBLISHED filter:', error);
  } finally {
    mongoose.disconnect();
  }
}

testNotPublishedFilter();
