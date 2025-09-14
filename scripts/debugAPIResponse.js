const AutotraderAPI = require('../utils/autotraderAPI');

async function debugAPIResponse() {
  try {
    console.log('Debugging API response structure...');
    
    const api = new AutotraderAPI();
    await api.authenticate();
    console.log('Authenticated successfully');
    
    const response = await api.getVehicles();
    console.log(`API returned ${response.vehicles.length} vehicles`);
    
    // Debug the first vehicle's structure
    if (response.vehicles.length > 0) {
      const firstVehicle = response.vehicles[0];
      console.log('\nFirst vehicle structure:');
      console.log(JSON.stringify(firstVehicle, null, 2));
      
      // Check for image data
      console.log('\nLooking for image data...');
      console.log('vehicle.vehicle:', firstVehicle.vehicle);
      console.log('vehicle.media:', firstVehicle.media);
      console.log('vehicle.retailAdverts:', firstVehicle.retailAdverts);
      
      if (firstVehicle.vehicle) {
        console.log('vehicle.vehicle.media:', firstVehicle.vehicle.media);
        console.log('vehicle.vehicle.retailAdverts:', firstVehicle.vehicle.retailAdverts);
      }
    }
    
  } catch (error) {
    console.error('Error debugging API response:', error);
  }
}

debugAPIResponse();
