const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Different images for different vehicle types and makes
const getImageForVehicle = (vehicle) => {
  const bodyType = (vehicle.bodyType || '').toLowerCase();
  const make = (vehicle.make || '').toLowerCase();
  const model = (vehicle.model || '').toLowerCase();
  
  // SUV images
  if (bodyType.includes('suv')) {
    const suvImages = [
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center'
    ];
    return suvImages[Math.floor(Math.random() * suvImages.length)];
  }
  
  // Hatchback images
  if (bodyType.includes('hatchback')) {
    const hatchbackImages = [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&crop=center'
    ];
    return hatchbackImages[Math.floor(Math.random() * hatchbackImages.length)];
  }
  
  // Saloon/Sedan images
  if (bodyType.includes('saloon') || bodyType.includes('sedan')) {
    const saloonImages = [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center'
    ];
    return saloonImages[Math.floor(Math.random() * saloonImages.length)];
  }
  
  // Brand-specific images
  if (make.includes('bmw')) {
    const bmwImages = [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center'
    ];
    return bmwImages[Math.floor(Math.random() * bmwImages.length)];
  }
  
  if (make.includes('audi')) {
    const audiImages = [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center'
    ];
    return audiImages[Math.floor(Math.random() * audiImages.length)];
  }
  
  if (make.includes('mercedes')) {
    const mercedesImages = [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center'
    ];
    return mercedesImages[Math.floor(Math.random() * mercedesImages.length)];
  }
  
  if (make.includes('tesla')) {
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center';
  }
  
  if (make.includes('porsche')) {
    return 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&crop=center';
  }
  
  if (make.includes('ferrari') || make.includes('lamborghini')) {
    return 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center';
  }
  
  if (make.includes('land rover') || make.includes('range rover')) {
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center';
  }
  
  if (make.includes('jaguar')) {
    return 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center';
  }
  
  if (make.includes('mg')) {
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center';
  }
  
  if (make.includes('vauxhall')) {
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center';
  }
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center';
};

async function updateAllImages() {
  try {
    console.log('Updating ALL vehicle images...');
    
    const vehicles = await VehicleModel.find({ status: 'available' });
    console.log(`Found ${vehicles.length} vehicles to update`);
    
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const newImage = getImageForVehicle(vehicle);
      
      await VehicleModel.findByIdAndUpdate(vehicle._id, {
        imagePath: newImage
      });
      
      console.log(`${i + 1}. Updated ${vehicle.title} (${vehicle.make} ${vehicle.model}) with new image`);
    }
    
    console.log('All vehicle images updated successfully!');
  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    mongoose.disconnect();
  }
}

updateAllImages();
