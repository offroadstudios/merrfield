const VehicleModel = require('../models/VehicleModel');
const AutotraderAPI = require('./autotraderAPI');

class EnhancedVehicleSyncService {
  constructor() {
    this.autotraderAPI = new AutotraderAPI();
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
    this.isRunning = false;
    this.syncTimer = null;
  }

  async syncVehiclesFromAutotrader(limit = 50) {
    try {
      console.log('Starting enhanced vehicle sync from Autotrader API...');
      
      // Get all vehicles from API
      const apiVehicles = await this.autotraderAPI.getVehicles(1, limit);
      
      if (!apiVehicles || !apiVehicles.vehicles || apiVehicles.vehicles.length === 0) {
        console.log('No vehicles found in API response');
        return { success: false, message: 'No vehicles found in API' };
      }

      console.log(`Found ${apiVehicles.vehicles.length} vehicles from API`);
      
      // Get all current vehicles in database
      const currentVehicles = await VehicleModel.find({});
      const currentVehicleIds = new Set(currentVehicles.map(v => v.autotraderId));
      
      // Get all API vehicle IDs
      const apiVehicleIds = new Set(apiVehicles.vehicles.map(v => v.metadata?.stockId || v.vehicle?.stockId || v.id));
      
      // Find vehicles to remove (in database but not in API)
      const vehiclesToRemove = currentVehicles.filter(v => !apiVehicleIds.has(v.autotraderId));
      
      // Remove vehicles that are no longer in API
      if (vehiclesToRemove.length > 0) {
        console.log(`Removing ${vehiclesToRemove.length} vehicles that are no longer in API:`);
        for (const vehicle of vehiclesToRemove) {
          console.log(`  - Removing: ${vehicle.title} (ID: ${vehicle.autotraderId})`);
        }
        
        const removeResult = await VehicleModel.deleteMany({
          autotraderId: { $in: vehiclesToRemove.map(v => v.autotraderId) }
        });
        console.log(`Removed ${removeResult.deletedCount} vehicles from database`);
      }
      
      // Process and update/add vehicles from API
      let addedCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;
      
      for (const vehicleData of apiVehicles.vehicles) {
        try {
          const transformedVehicle = this.autotraderAPI.transformVehicleData(vehicleData);
          
          // Check if vehicle exists
          const existingVehicle = await VehicleModel.findOne({ 
            autotraderId: transformedVehicle.autotraderId 
          });
          
          if (existingVehicle) {
            // Update existing vehicle
            await VehicleModel.updateOne(
              { autotraderId: transformedVehicle.autotraderId },
              { 
                ...transformedVehicle,
                updatedAt: new Date()
              }
            );
            updatedCount++;
            console.log(`Updated existing vehicle: ${transformedVehicle.title}`);
          } else {
            // Add new vehicle
            const newVehicle = new VehicleModel(transformedVehicle);
            await newVehicle.save();
            addedCount++;
            console.log(`Added new vehicle: ${transformedVehicle.title}`);
          }
        } catch (error) {
          console.error(`Error processing vehicle ${vehicleData.metadata?.stockId || vehicleData.id}:`, error.message);
          skippedCount++;
        }
      }
      
      const result = {
        success: true,
        synced: addedCount + updatedCount,
        added: addedCount,
        updated: updatedCount,
        removed: vehiclesToRemove.length,
        skipped: skippedCount,
        total: apiVehicles.vehicles.length
      };
      
      console.log('Enhanced sync completed:', result);
      return result;
      
    } catch (error) {
      console.error('Error in enhanced vehicle sync:', error);
      return { success: false, error: error.message };
    }
  }

  // Start automatic sync
  startAutoSync() {
    if (this.isRunning) {
      console.log('Auto sync is already running');
      return;
    }
    
    console.log(`Starting auto sync every ${this.syncInterval / 1000} seconds...`);
    this.isRunning = true;
    
    // Run initial sync
    this.syncVehiclesFromAutotrader(100);
    
    // Set up interval
    this.syncTimer = setInterval(async () => {
      try {
        console.log('Running scheduled auto sync...');
        await this.syncVehiclesFromAutotrader(100);
      } catch (error) {
        console.error('Error in scheduled auto sync:', error);
      }
    }, this.syncInterval);
  }

  // Stop automatic sync
  stopAutoSync() {
    if (!this.isRunning) {
      console.log('Auto sync is not running');
      return;
    }
    
    console.log('Stopping auto sync...');
    this.isRunning = false;
    
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  // Get sync status
  getSyncStatus() {
    return {
      isRunning: this.isRunning,
      syncInterval: this.syncInterval,
      nextSyncIn: this.syncTimer ? this.syncInterval : 0
    };
  }

  // Force sync now
  async forceSync() {
    console.log('Force sync requested...');
    return await this.syncVehiclesFromAutotrader(100);
  }
}

module.exports = EnhancedVehicleSyncService;
