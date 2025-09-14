const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

async function addSampleData() {
  try {
    console.log('Adding sample vehicle data...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await VehicleModel.deleteMany({});
    console.log('Cleared existing vehicle data');

    // Sample vehicles data
    const sampleVehicles = [
      {
        title: '2020 BMW X5 xDrive30d M Sport',
        description: 'Luxury SUV with premium features, leather interior, and advanced safety systems. Perfect for families who demand both comfort and performance.',
        price: 45000,
        imagePath: '/images/bmw.jpg',
        year: 2020,
        brand: 'BMW',
        model: 'X5',
        fuelType: 'Diesel',
        autotraderId: 'sample-bmw-x5-001',
        category: 'cars',
        bodyType: 'SUV',
        mileage: 25000,
        transmission: 'Automatic',
        doors: 5,
        seats: 5,
        co2Emissions: 180,
        engineSize: '3.0L',
        power: '265 BHP',
        topSpeed: 140,
        acceleration: 6.5,
        mpg: 42,
        tax: 150,
        insurance: 'Group 40',
        drivetrain: 'AWD',
        cylinders: 6,
        colour: 'Mineral Grey',
        previousOwners: 1,
        serviceHistory: 'Full BMW Service History',
        status: 'available'
      },
      {
        title: '2019 Audi A3 Sportback 35 TFSI S Line',
        description: 'Compact and efficient hatchback with sporty styling. Perfect for city driving with excellent fuel economy and premium interior.',
        price: 22000,
        imagePath: '/images/au1.jpg',
        year: 2019,
        brand: 'Audi',
        model: 'A3',
        fuelType: 'Petrol',
        autotraderId: 'sample-audi-a3-001',
        category: 'cars',
        bodyType: 'Hatchback',
        mileage: 30000,
        transmission: 'Manual',
        doors: 5,
        seats: 5,
        co2Emissions: 120,
        engineSize: '1.5L',
        power: '150 BHP',
        topSpeed: 135,
        acceleration: 8.2,
        mpg: 52,
        tax: 140,
        insurance: 'Group 20',
        drivetrain: 'FWD',
        cylinders: 4,
        colour: 'Mythos Black',
        previousOwners: 2,
        serviceHistory: 'Full Audi Service History',
        status: 'available'
      },
      {
        title: '2021 Mercedes C-Class C220d AMG Line',
        description: 'Executive saloon with advanced technology and luxurious interior. Perfect for business use with excellent comfort and refinement.',
        price: 35000,
        imagePath: '/images/mus.jpg',
        year: 2021,
        brand: 'Mercedes',
        model: 'C-Class',
        fuelType: 'Diesel',
        autotraderId: 'sample-mercedes-c220-001',
        category: 'cars',
        bodyType: 'Saloon',
        mileage: 15000,
        transmission: 'Automatic',
        doors: 4,
        seats: 5,
        co2Emissions: 130,
        engineSize: '2.0L',
        power: '194 BHP',
        topSpeed: 145,
        acceleration: 7.3,
        mpg: 58,
        tax: 145,
        insurance: 'Group 30',
        drivetrain: 'RWD',
        cylinders: 4,
        colour: 'Obsidian Black',
        previousOwners: 1,
        serviceHistory: 'Full Mercedes Service History',
        status: 'available'
      },
      {
        title: '2020 Ford Focus ST-3 Hatchback',
        description: 'High-performance hot hatch with sporty styling and excellent handling. Perfect for driving enthusiasts who want practicality with excitement.',
        price: 18500,
        imagePath: '/images/fi1.jpg',
        year: 2020,
        brand: 'Ford',
        model: 'Focus',
        fuelType: 'Petrol',
        autotraderId: 'sample-ford-focus-st-001',
        category: 'cars',
        bodyType: 'Hatchback',
        mileage: 22000,
        transmission: 'Manual',
        doors: 5,
        seats: 5,
        co2Emissions: 140,
        engineSize: '2.3L',
        power: '280 BHP',
        topSpeed: 155,
        acceleration: 5.7,
        mpg: 35,
        tax: 180,
        insurance: 'Group 35',
        drivetrain: 'FWD',
        cylinders: 4,
        colour: 'Performance Blue',
        previousOwners: 1,
        serviceHistory: 'Full Ford Service History',
        status: 'available'
      },
      {
        title: '2019 Honda CR-V 1.6 i-DTEC EX',
        description: 'Reliable and practical SUV with excellent fuel economy and spacious interior. Perfect for families who need space and reliability.',
        price: 28000,
        imagePath: '/images/honda.jpg',
        year: 2019,
        brand: 'Honda',
        model: 'CR-V',
        fuelType: 'Diesel',
        autotraderId: 'sample-honda-crv-001',
        category: 'cars',
        bodyType: 'SUV',
        mileage: 35000,
        transmission: 'Manual',
        doors: 5,
        seats: 5,
        co2Emissions: 125,
        engineSize: '1.6L',
        power: '160 BHP',
        topSpeed: 125,
        acceleration: 9.5,
        mpg: 55,
        tax: 130,
        insurance: 'Group 25',
        drivetrain: 'FWD',
        cylinders: 4,
        colour: 'Pearl White',
        previousOwners: 2,
        serviceHistory: 'Full Honda Service History',
        status: 'available'
      },
      {
        title: '2020 Tesla Model 3 Standard Range Plus',
        description: 'Electric saloon with cutting-edge technology and zero emissions. Perfect for environmentally conscious drivers who want the latest tech.',
        price: 42000,
        imagePath: '/images/tesla.mp4',
        year: 2020,
        brand: 'Tesla',
        model: 'Model 3',
        fuelType: 'Electric',
        autotraderId: 'sample-tesla-model3-001',
        category: 'cars',
        bodyType: 'Saloon',
        mileage: 18000,
        transmission: 'Automatic',
        doors: 4,
        seats: 5,
        co2Emissions: 0,
        engineSize: 'Electric',
        power: '283 BHP',
        topSpeed: 140,
        acceleration: 5.3,
        mpg: 0,
        tax: 0,
        insurance: 'Group 30',
        drivetrain: 'RWD',
        cylinders: 0,
        colour: 'Pearl White Multi-Coat',
        previousOwners: 1,
        serviceHistory: 'Full Tesla Service History',
        status: 'available'
      },
      {
        title: '2018 Volkswagen Golf GTI Performance',
        description: 'Iconic hot hatch with perfect balance of performance and practicality. The benchmark for hot hatches with excellent build quality.',
        price: 24000,
        imagePath: '/images/do.png',
        year: 2018,
        brand: 'Volkswagen',
        model: 'Golf',
        fuelType: 'Petrol',
        autotraderId: 'sample-vw-golf-gti-001',
        category: 'cars',
        bodyType: 'Hatchback',
        mileage: 40000,
        transmission: 'Manual',
        doors: 5,
        seats: 5,
        co2Emissions: 145,
        engineSize: '2.0L',
        power: '245 BHP',
        topSpeed: 155,
        acceleration: 6.2,
        mpg: 38,
        tax: 165,
        insurance: 'Group 32',
        drivetrain: 'FWD',
        cylinders: 4,
        colour: 'Tornado Red',
        previousOwners: 2,
        serviceHistory: 'Full VW Service History',
        status: 'available'
      },
      {
        title: '2021 Kia Sportage 2.0 CRDi GT-Line',
        description: 'Well-equipped SUV with excellent warranty and modern styling. Great value for money with premium features and reliability.',
        price: 26000,
        imagePath: '/images/kia.png',
        year: 2021,
        brand: 'Kia',
        model: 'Sportage',
        fuelType: 'Diesel',
        autotraderId: 'sample-kia-sportage-001',
        category: 'cars',
        bodyType: 'SUV',
        mileage: 12000,
        transmission: 'Manual',
        doors: 5,
        seats: 5,
        co2Emissions: 135,
        engineSize: '2.0L',
        power: '185 BHP',
        topSpeed: 130,
        acceleration: 9.2,
        mpg: 50,
        tax: 140,
        insurance: 'Group 28',
        drivetrain: 'FWD',
        cylinders: 4,
        colour: 'Gravity Blue',
        previousOwners: 1,
        serviceHistory: 'Full Kia Service History',
        status: 'available'
      },
      {
        title: '2019 Jaguar F-PACE 2.0d R-Sport',
        description: 'Luxury SUV with sporty styling and premium interior. Perfect for those who want luxury and performance in a practical package.',
        price: 38000,
        imagePath: '/images/je.jpg',
        year: 2019,
        brand: 'Jaguar',
        model: 'F-PACE',
        fuelType: 'Diesel',
        autotraderId: 'sample-jaguar-fpace-001',
        category: 'cars',
        bodyType: 'SUV',
        mileage: 28000,
        transmission: 'Automatic',
        doors: 5,
        seats: 5,
        co2Emissions: 150,
        engineSize: '2.0L',
        power: '180 BHP',
        topSpeed: 135,
        acceleration: 8.7,
        mpg: 45,
        tax: 155,
        insurance: 'Group 33',
        drivetrain: 'AWD',
        cylinders: 4,
        colour: 'Firenze Red',
        previousOwners: 1,
        serviceHistory: 'Full Jaguar Service History',
        status: 'available'
      },
      {
        title: '2020 Nissan Qashqai 1.3 DIG-T Tekna',
        description: 'Popular crossover with modern styling and practical features. Great family car with excellent reliability and low running costs.',
        price: 22000,
        imagePath: '/images/rap.png',
        year: 2020,
        brand: 'Nissan',
        model: 'Qashqai',
        fuelType: 'Petrol',
        autotraderId: 'sample-nissan-qashqai-001',
        category: 'cars',
        bodyType: 'SUV',
        mileage: 20000,
        transmission: 'Manual',
        doors: 5,
        seats: 5,
        co2Emissions: 130,
        engineSize: '1.3L',
        power: '140 BHP',
        topSpeed: 125,
        acceleration: 9.9,
        mpg: 48,
        tax: 140,
        insurance: 'Group 22',
        drivetrain: 'FWD',
        cylinders: 4,
        colour: 'Pearl Black',
        previousOwners: 1,
        serviceHistory: 'Full Nissan Service History',
        status: 'available'
      }
    ];

    // Add vehicles to database
    for (const vehicleData of sampleVehicles) {
      const vehicle = new VehicleModel(vehicleData);
      await vehicle.save();
      console.log(`Added vehicle: ${vehicleData.title}`);
    }

    console.log(`Successfully added ${sampleVehicles.length} sample vehicles to the database`);
    
    // Show statistics
    const stats = await VehicleModel.aggregate([
      { $group: { 
        _id: '$bodyType', 
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }},
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nVehicle Statistics by Body Type:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} vehicles, Average Price: £${Math.round(stat.avgPrice)}`);
    });
    
  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addSampleData();
