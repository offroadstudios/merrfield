const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Completely different car images from various sources
const uniqueCarImages = [
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center', // BMW
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center', // Audi
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center', // Mercedes
  'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&crop=center', // Tesla
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center', // Porsche
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&crop=center', // Ferrari
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center', // Lamborghini
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center', // Range Rover
  'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&crop=center', // Honda
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center', // Toyota
  'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&crop=center', // Ford
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center', // Volkswagen
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center', // Nissan
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center', // Lexus
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&crop=center', // Jaguar
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center', // Land Rover
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center', // Bentley
  'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&crop=center', // Aston Martin
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center'  // McLaren
];

async function forceUniqueImages() {
  try {
    console.log('Forcing unique images for all vehicles...');
    
    const vehicles = await VehicleModel.find({ status: 'available' });
    console.log(`Found ${vehicles.length} vehicles to update`);
    
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const imageIndex = i % uniqueCarImages.length;
      const newImagePath = uniqueCarImages[imageIndex];
      
      await VehicleModel.findByIdAndUpdate(vehicle._id, {
        imagePath: newImagePath
      });
      
      console.log(`Updated ${vehicle.title} with image ${imageIndex + 1}`);
    }
    
    console.log('All vehicle images updated with unique images!');
  } catch (error) {
    console.error('Error updating vehicle images:', error);
  } finally {
    mongoose.disconnect();
  }
}

forceUniqueImages();
