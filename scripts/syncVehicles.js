const VehicleSyncService = require('../utils/vehicleSyncService');

async function syncVehicles() {
  try {
    console.log('Starting vehicle sync...');
    
    const syncService = new VehicleSyncService();
    await syncService.syncVehiclesFromAutotrader();
    
    console.log('Vehicle sync completed successfully!');
  } catch (error) {
    console.error('Error syncing vehicles:', error);
  }
}

syncVehicles();
