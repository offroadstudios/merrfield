const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function checkDuplicates() {
  try {
    console.log('=== CHECKING FOR DUPLICATES ===');
    
    const vehicles = await VehicleModel.find({}).sort({ title: 1 });
    console.log(`Total vehicles: ${vehicles.length}`);
    
    // Group by title
    const grouped = {};
    vehicles.forEach(vehicle => {
      if (!grouped[vehicle.title]) {
        grouped[vehicle.title] = [];
      }
      grouped[vehicle.title].push(vehicle);
    });
    
    // Check for duplicates
    Object.keys(grouped).forEach(title => {
      const group = grouped[title];
      if (group.length > 1) {
        console.log(`\n${title} (${group.length} duplicates):`);
        group.forEach((vehicle, index) => {
          console.log(`  ${index + 1}. ID: ${vehicle._id}`);
          console.log(`     imagePath: ${vehicle.imagePath}`);
          console.log(`     images count: ${vehicle.images ? vehicle.images.length : 0}`);
        });
      }
    });
    
    // Show unique vehicles
    console.log('\n=== UNIQUE VEHICLES ===');
    const uniqueVehicles = await VehicleModel.aggregate([
      { $group: { _id: "$title", count: { $sum: 1 }, first: { $first: "$$ROOT" } } },
      { $sort: { _id: 1 } }
    ]);
    
    uniqueVehicles.forEach(item => {
      console.log(`${item._id}: ${item.count} copies`);
      console.log(`  imagePath: ${item.first.imagePath}`);
      console.log(`  images count: ${item.first.images ? item.first.images.length : 0}`);
    });
    
  } catch (error) {
    console.error('Error checking duplicates:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkDuplicates();
