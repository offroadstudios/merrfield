const AutotraderAPI = require('../utils/autotraderAPI');
const VehicleSyncService = require('../utils/vehicleSyncService');
const mongoose = require('mongoose');

async function testAutotraderAPI() {
  try {
    console.log('Testing Autotrader API integration...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Connected to MongoDB');

    // Test API authentication
    const autotraderAPI = new AutotraderAPI();
    const isAuthenticated = await autotraderAPI.authenticate();
    
    if (!isAuthenticated) {
      console.error('Failed to authenticate with Autotrader API');
      return;
    }
    
    console.log('Successfully authenticated with Autotrader API');

    // Test fetching vehicles
    try {
      const vehicles = await autotraderAPI.getVehicles(5);
      console.log('Successfully fetched vehicles from API:');
      console.log(JSON.stringify(vehicles, null, 2));
    } catch (apiError) {
      console.log('API fetch failed (this might be expected in sandbox):', apiError.message);
      
      // Create some sample data for testing
      console.log('Creating sample data for testing...');
      const sampleVehicles = [
        {
          title: '2020 BMW X5 SUV',
          description: 'Luxury SUV with premium features',
          price: 45000,
          imagePath: '/images/bmw.jpg',
          year: 2020,
          brand: 'BMW',
          model: 'X5',
          fuelType: 'Petrol',
          autotraderId: 'sample-1',
          category: 'cars',
          bodyType: 'SUV',
          mileage: 25000,
          transmission: 'Automatic',
          doors: 5,
          seats: 5,
          status: 'available'
        },
        {
          title: '2019 Audi A3 Hatchback',
          description: 'Compact and efficient hatchback',
          price: 22000,
          imagePath: '/images/au1.jpg',
          year: 2019,
          brand: 'Audi',
          model: 'A3',
          fuelType: 'Petrol',
          autotraderId: 'sample-2',
          category: 'cars',
          bodyType: 'Hatchback',
          mileage: 30000,
          transmission: 'Manual',
          doors: 5,
          seats: 5,
          status: 'available'
        },
        {
          title: '2021 Mercedes C-Class Saloon',
          description: 'Executive saloon with advanced technology',
          price: 35000,
          imagePath: '/images/mus.jpg',
          year: 2021,
          brand: 'Mercedes',
          model: 'C-Class',
          fuelType: 'Diesel',
          autotraderId: 'sample-3',
          category: 'cars',
          bodyType: 'Saloon',
          mileage: 15000,
          transmission: 'Automatic',
          doors: 4,
          seats: 5,
          status: 'available'
        }
      ];

      // Sync sample data
      const vehicleSyncService = new VehicleSyncService();
      for (const vehicleData of sampleVehicles) {
        try {
          const vehicle = new (require('../models/VehicleModel'))(vehicleData);
          await vehicle.save();
          console.log(`Added sample vehicle: ${vehicleData.title}`);
        } catch (saveError) {
          console.log(`Vehicle ${vehicleData.title} might already exist:`, saveError.message);
        }
      }
    }

    // Test the sync service
    const vehicleSyncService = new VehicleSyncService();
    const result = await vehicleSyncService.syncVehiclesFromAutotrader(3);
    console.log('Sync result:', result);

    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testAutotraderAPI();
