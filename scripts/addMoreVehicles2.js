const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const additionalVehicles = [
  {
    title: 'Tesla Model 3 Performance',
    description: 'Electric luxury sedan with incredible performance',
    price: 55000,
    imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/42f1d89a24cc473f875e809fa0db990e.jpg',
    year: 2022,
    brand: 'Tesla',
    model: 'Model 3',
    fuelType: 'Electric',
    autotraderId: 'tesla_model3_performance_001',
    category: 'cars',
    bodyType: 'Saloon',
    mileage: 5000,
    transmission: 'Automatic',
    doors: 4,
    seats: 5,
    co2Emissions: 0,
    engineSize: 'Electric',
    power: '450',
    topSpeed: 162,
    acceleration: 3.1,
    mpg: 0,
    tax: 0,
    insurance: 'Group 50',
    drivetrain: 'AWD',
    cylinders: 0,
    colour: 'Pearl White',
    previousOwners: 0,
    serviceHistory: 'Full Service History',
    status: 'available'
  },
  {
    title: 'Porsche 911 Carrera',
    description: 'Iconic sports car with legendary performance',
    price: 85000,
    imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/a805315414c144c49dcb6becda0ce740.jpg',
    year: 2021,
    brand: 'Porsche',
    model: '911',
    fuelType: 'Petrol',
    autotraderId: 'porsche_911_carrera_001',
    category: 'cars',
    bodyType: 'Coupe',
    mileage: 12000,
    transmission: 'Manual',
    doors: 2,
    seats: 4,
    co2Emissions: 220,
    engineSize: '3.0',
    power: '385',
    topSpeed: 182,
    acceleration: 4.2,
    mpg: 28,
    tax: 350,
    insurance: 'Group 50',
    drivetrain: 'RWD',
    cylinders: 6,
    colour: 'Guards Red',
    previousOwners: 1,
    serviceHistory: 'Full Service History',
    status: 'available'
  },
  {
    title: 'Range Rover Sport SVR',
    description: 'High-performance luxury SUV',
    price: 95000,
    imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/45946c9cef9e4f189d0114d81ef260d6.jpg',
    year: 2022,
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    fuelType: 'Petrol',
    autotraderId: 'range_rover_sport_svr_001',
    category: 'cars',
    bodyType: 'SUV',
    mileage: 8000,
    transmission: 'Automatic',
    doors: 5,
    seats: 5,
    co2Emissions: 280,
    engineSize: '5.0',
    power: '575',
    topSpeed: 176,
    acceleration: 4.3,
    mpg: 22,
    tax: 450,
    insurance: 'Group 50',
    drivetrain: 'AWD',
    cylinders: 8,
    colour: 'Santorini Black',
    previousOwners: 0,
    serviceHistory: 'Full Service History',
    status: 'available'
  },
  {
    title: 'Lamborghini Huracán',
    description: 'Exotic supercar with breathtaking performance',
    price: 180000,
    imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/c21c834da7524356a5adab9bc01785ef.jpg',
    year: 2021,
    brand: 'Lamborghini',
    model: 'Huracán',
    fuelType: 'Petrol',
    autotraderId: 'lamborghini_huracan_001',
    category: 'cars',
    bodyType: 'Coupe',
    mileage: 3000,
    transmission: 'Automatic',
    doors: 2,
    seats: 2,
    co2Emissions: 350,
    engineSize: '5.2',
    power: '610',
    topSpeed: 201,
    acceleration: 3.2,
    mpg: 18,
    tax: 600,
    insurance: 'Group 50',
    drivetrain: 'AWD',
    cylinders: 10,
    colour: 'Giallo Inti',
    previousOwners: 0,
    serviceHistory: 'Full Service History',
    status: 'available'
  },
  {
    title: 'Ferrari 488 GTB',
    description: 'Mid-engine supercar with V8 power',
    price: 200000,
    imagePath: 'https://m-qa.atcdn.co.uk/a/media/800x600/8a82192e44b34f5a95743e47a4788e22.jpg',
    year: 2020,
    brand: 'Ferrari',
    model: '488',
    fuelType: 'Petrol',
    autotraderId: 'ferrari_488_gtb_001',
    category: 'cars',
    bodyType: 'Coupe',
    mileage: 5000,
    transmission: 'Automatic',
    doors: 2,
    seats: 2,
    co2Emissions: 360,
    engineSize: '3.9',
    power: '670',
    topSpeed: 205,
    acceleration: 3.0,
    mpg: 16,
    tax: 650,
    insurance: 'Group 50',
    drivetrain: 'RWD',
    cylinders: 8,
    colour: 'Rosso Corsa',
    previousOwners: 1,
    serviceHistory: 'Full Service History',
    status: 'available'
  }
];

async function addVehicles() {
  try {
    console.log('Adding additional vehicles to reach 20 total...');
    
    for (const vehicleData of additionalVehicles) {
      // Check if vehicle already exists
      const existingVehicle = await VehicleModel.findOne({ 
        autotraderId: vehicleData.autotraderId 
      });
      
      if (!existingVehicle) {
        const vehicle = new VehicleModel(vehicleData);
        await vehicle.save();
        console.log(`Added vehicle: ${vehicleData.title}`);
      } else {
        console.log(`Vehicle already exists: ${vehicleData.title}`);
      }
    }
    
    // Count total vehicles
    const totalVehicles = await VehicleModel.countDocuments({ status: 'available' });
    console.log(`Total vehicles in database: ${totalVehicles}`);
    
    console.log('Additional vehicles added successfully!');
  } catch (error) {
    console.error('Error adding vehicles:', error);
  } finally {
    mongoose.disconnect();
  }
}

addVehicles();
