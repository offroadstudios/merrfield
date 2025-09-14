const AutotraderAPI = require('../utils/autotraderAPI');

async function debugAPIImages() {
  try {
    console.log('Debugging API image structure...');
    
    const api = new AutotraderAPI();
    await api.authenticate();
    console.log('Authenticated successfully');
    
    const response = await api.getVehicles();
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    // Debug the first few vehicles' image structure
    for (let i = 0; i < Math.min(3, response.vehicles.length); i++) {
      const vehicle = response.vehicles[i];
      console.log(`\n=== Vehicle ${i + 1}: ${vehicle.vehicle?.make} ${vehicle.vehicle?.model} ===`);
      
      // Check all possible image locations
      console.log('vehicle.media:', JSON.stringify(vehicle.media, null, 2));
      console.log('vehicle.vehicle.media:', JSON.stringify(vehicle.vehicle?.media, null, 2));
      console.log('vehicle.adverts:', JSON.stringify(vehicle.adverts, null, 2));
      console.log('vehicle.retailAdverts:', JSON.stringify(vehicle.retailAdverts, null, 2));
      
      // Check if there are any image-related fields
      const allKeys = Object.keys(vehicle);
      console.log('All top-level keys:', allKeys);
      
      // Look for any field that might contain images
      for (const key of allKeys) {
        if (typeof vehicle[key] === 'object' && vehicle[key] !== null) {
          const subKeys = Object.keys(vehicle[key]);
          if (subKeys.some(k => k.toLowerCase().includes('image') || k.toLowerCase().includes('media') || k.toLowerCase().includes('photo'))) {
            console.log(`Found potential image field in ${key}:`, JSON.stringify(vehicle[key], null, 2));
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error debugging API images:', error);
  }
}

debugAPIImages();
