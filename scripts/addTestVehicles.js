const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

async function addTestVehicles() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Connected to MongoDB');

    // Clear existing vehicles
    await VehicleModel.deleteMany({});
    console.log('Cleared existing vehicles');

    // Add test vehicles with different images
    const testVehicles = [
      {
        title: 'BMW X5',
        brand: 'BMW',
        model: 'X5',
        bodyType: 'SUV',
        price: 45000,
        year: 2022,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        mileage: 15000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/42f1d89a24cc473f875e809fa0db990e.jpg',
        status: 'available'
      },
      {
        title: 'Audi A4',
        brand: 'Audi',
        model: 'A4',
        bodyType: 'Saloon',
        price: 35000,
        year: 2021,
        fuelType: 'Diesel',
        transmission: 'Manual',
        mileage: 25000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/45946c9cef9e4f189d0114d81ef260d6.jpg',
        status: 'available'
      },
      {
        title: 'Mercedes C-Class',
        brand: 'Mercedes-Benz',
        model: 'C-Class',
        bodyType: 'Saloon',
        price: 40000,
        year: 2023,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        mileage: 5000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/ff3f335d3da4450d9592e12c7ce6a306.jpg',
        status: 'available'
      },
      {
        title: 'Ford Focus',
        brand: 'Ford',
        model: 'Focus',
        bodyType: 'Hatchback',
        price: 20000,
        year: 2020,
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 30000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/284526a256d04335a6a24e0e67ca7a0e.jpg',
        status: 'available'
      },
      {
        title: 'Volkswagen Golf',
        brand: 'Volkswagen',
        model: 'Golf',
        bodyType: 'Hatchback',
        price: 25000,
        year: 2021,
        fuelType: 'Diesel',
        transmission: 'Manual',
        mileage: 20000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/099301534ba74ff7a20c8eff4408527a.jpg',
        status: 'available'
      },
      {
        title: 'Toyota Camry',
        brand: 'Toyota',
        model: 'Camry',
        bodyType: 'Saloon',
        price: 28000,
        year: 2022,
        fuelType: 'Hybrid',
        transmission: 'CVT',
        mileage: 18000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg',
        status: 'available'
      },
      {
        title: 'Honda Civic',
        brand: 'Honda',
        model: 'Civic',
        bodyType: 'Hatchback',
        price: 22000,
        year: 2021,
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 22000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e.jpg',
        status: 'available'
      },
      {
        title: 'Nissan Qashqai',
        brand: 'Nissan',
        model: 'Qashqai',
        bodyType: 'SUV',
        price: 32000,
        year: 2022,
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 12000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f.jpg',
        status: 'available'
      },
      {
        title: 'Hyundai i30',
        brand: 'Hyundai',
        model: 'i30',
        bodyType: 'Hatchback',
        price: 19000,
        year: 2020,
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 35000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a.jpg',
        status: 'available'
      },
      {
        title: 'Kia Sportage',
        brand: 'Kia',
        model: 'Sportage',
        bodyType: 'SUV',
        price: 30000,
        year: 2021,
        fuelType: 'Diesel',
        transmission: 'Manual',
        mileage: 20000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b.jpg',
        status: 'available'
      },
      {
        title: 'Mazda CX-5',
        brand: 'Mazda',
        model: 'CX-5',
        bodyType: 'SUV',
        price: 35000,
        year: 2022,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        mileage: 10000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c.jpg',
        status: 'available'
      },
      {
        title: 'Skoda Octavia',
        brand: 'Skoda',
        model: 'Octavia',
        bodyType: 'Saloon',
        price: 26000,
        year: 2021,
        fuelType: 'Diesel',
        transmission: 'Manual',
        mileage: 25000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d.jpg',
        status: 'available'
      },
      {
        title: 'Peugeot 308',
        brand: 'Peugeot',
        model: '308',
        bodyType: 'Hatchback',
        price: 21000,
        year: 2020,
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 30000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e.jpg',
        status: 'available'
      },
      {
        title: 'Renault Clio',
        brand: 'Renault',
        model: 'Clio',
        bodyType: 'Hatchback',
        price: 18000,
        year: 2021,
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 22000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f.jpg',
        status: 'available'
      },
      {
        title: 'SEAT Leon',
        brand: 'SEAT',
        model: 'Leon',
        bodyType: 'Hatchback',
        price: 23000,
        year: 2022,
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 15000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a.jpg',
        status: 'available'
      },
      {
        title: 'Volvo XC40',
        brand: 'Volvo',
        model: 'XC40',
        bodyType: 'SUV',
        price: 42000,
        year: 2022,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        mileage: 8000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b.jpg',
        status: 'available'
      },
      {
        title: 'Jaguar XE',
        brand: 'Jaguar',
        model: 'XE',
        bodyType: 'Saloon',
        price: 38000,
        year: 2021,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        mileage: 18000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c.jpg',
        status: 'available'
      },
      {
        title: 'Land Rover Discovery Sport',
        brand: 'Land Rover',
        model: 'Discovery Sport',
        bodyType: 'SUV',
        price: 48000,
        year: 2022,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        mileage: 12000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d.jpg',
        status: 'available'
      },
      {
        title: 'Lexus IS',
        brand: 'Lexus',
        model: 'IS',
        bodyType: 'Saloon',
        price: 40000,
        year: 2021,
        fuelType: 'Hybrid',
        transmission: 'CVT',
        mileage: 16000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e.jpg',
        status: 'available'
      },
      {
        title: 'Infiniti Q50',
        brand: 'Infiniti',
        model: 'Q50',
        bodyType: 'Saloon',
        price: 36000,
        year: 2020,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        mileage: 28000,
        imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f.jpg',
        status: 'available'
      }
    ];

    for (const vehicleData of testVehicles) {
      const vehicle = new VehicleModel(vehicleData);
      await vehicle.save();
      console.log(`Added: ${vehicleData.title}`);
    }

    console.log('Test vehicles added successfully!');
    
    // Test the query
    const allVehicles = await VehicleModel.find({});
    console.log(`Total vehicles in database: ${allVehicles.length}`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

addTestVehicles();
