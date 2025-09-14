const AutotraderAPI = require('../utils/autotraderAPI');

async function checkAPIImages() {
  try {
    console.log('Checking what images the API actually returns...');
    
    const api = new AutotraderAPI();
    await api.authenticate();
    console.log('Authenticated successfully');
    
    const response = await api.getVehicles();
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    // Check the first 5 vehicles' images
    for (let i = 0; i < Math.min(5, response.vehicles.length); i++) {
      const vehicle = response.vehicles[i];
      const transformed = api.transformVehicleData(vehicle);
      console.log(`${i + 1}. ${transformed.title}`);
      console.log(`   Image: ${transformed.imagePath}`);
      console.log('---');
    }
    
  } catch (error) {
    console.error('Error checking API images:', error);
  }
}

checkAPIImages();
