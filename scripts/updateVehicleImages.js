const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Array of unique image URLs from Autotrader API
const uniqueImages = [
  'https://m-qa.atcdn.co.uk/a/media/800x600/42f1d89a24cc473f875e809fa0db990e.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/a805315414c144c49dcb6becda0ce740.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/45946c9cef9e4f189d0114d81ef260d6.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/c21c834da7524356a5adab9bc01785ef.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/8a82192e44b34f5a95743e47a4788e22.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/284526a256d04335a6a24e0e67ca7a0e.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/099301534ba74ff7a20c8eff4408527a.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/ff3f335d3da4450d9592e12c7ce6a306.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/7fc20a8ffbff4bde82ac83744d1974ad.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/85e4b706a876407494670eb131c02ed3.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/ec8ae44461d04209980b04d4cd6b6922.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/3c673314fef64ff38232ffce11756591.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/791db17469594853bc33150e3eb9ccbf.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/c468960ccfe04620994780a50c34b6e4.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/ca24485b5e4c47eb8e53def000e1beab.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/82a654e77c08431691c9f1171da1f193.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/fe4aa2726ac64a40afe307b4237f43b1.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/5aa67c7649474afb8f7f03dc24610ea9.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/46eed564be86450b9221caeeba2303c5.jpg',
  'https://m-qa.atcdn.co.uk/a/media/800x600/6397f1ad7ac3441399f86dea10e4be56.jpg'
];

async function updateVehicleImages() {
  try {
    console.log('Updating vehicle images to ensure uniqueness...');
    
    const vehicles = await VehicleModel.find({ status: 'available' });
    console.log(`Found ${vehicles.length} vehicles to update`);
    
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const imageIndex = i % uniqueImages.length;
      const newImagePath = uniqueImages[imageIndex];
      
      await VehicleModel.findByIdAndUpdate(vehicle._id, {
        imagePath: newImagePath
      });
      
      console.log(`Updated ${vehicle.title} with image ${imageIndex + 1}`);
    }
    
    console.log('Vehicle images updated successfully!');
  } catch (error) {
    console.error('Error updating vehicle images:', error);
  } finally {
    mongoose.disconnect();
  }
}

updateVehicleImages();
