const AutotraderAPI = require('./autotraderAPI');
const VehicleModel = require('../models/VehicleModel');

class FullSyncService {
  constructor() {
    this.autotraderAPI = new AutotraderAPI();
    this.isRunning = false;
  }

  async performFullSync() {
    if (this.isRunning) {
      console.log('Full sync already in progress, skipping...');
      return { success: false, message: 'Sync already in progress' };
    }

    this.isRunning = true;
    console.log('🚀 Starting full sync with Autotrader API...');

    try {
      // Step 1: Fetch all published vehicles from API (multiple pages)
      const allApiVehicles = await this.fetchAllPublishedVehicles();
      console.log(`📊 Found ${allApiVehicles.length} published vehicles in API`);

      // Step 2: Get all current vehicles in database
      const currentVehicles = await VehicleModel.find({});
      console.log(`📊 Found ${currentVehicles.length} vehicles in database`);

      // Step 3: Create a map of API vehicles by autotraderId
      const apiVehicleMap = new Map();
      allApiVehicles.forEach(vehicle => {
        const transformedData = this.autotraderAPI.transformVehicleData(vehicle);
        if (transformedData) { // Only include published vehicles
          apiVehicleMap.set(transformedData.autotraderId, transformedData);
        }
      });

      // Step 4: Find vehicles to remove (in database but not in API)
      const vehiclesToRemove = currentVehicles.filter(v => !apiVehicleMap.has(v.autotraderId));
      
      // Step 5: Remove vehicles that are no longer published
      let removedCount = 0;
      if (vehiclesToRemove.length > 0) {
        console.log(`🗑️  Removing ${vehiclesToRemove.length} vehicles that are no longer published:`);
        for (const vehicle of vehiclesToRemove) {
          console.log(`   - Removing: ${vehicle.title} (${vehicle.registration || 'No Reg'})`);
        }
        
        const removeResult = await VehicleModel.deleteMany({
          autotraderId: { $in: vehiclesToRemove.map(v => v.autotraderId) }
        });
        removedCount = removeResult.deletedCount;
        console.log(`✅ Removed ${removedCount} vehicles from database`);
      }

      // Step 6: Add/update vehicles from API
      let addedCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      for (const [autotraderId, transformedData] of apiVehicleMap) {
        try {
          const existingVehicle = await VehicleModel.findOne({ autotraderId });
          
          if (existingVehicle) {
            // Update existing vehicle
            await VehicleModel.updateOne(
              { autotraderId },
              { 
                ...transformedData,
                updatedAt: new Date()
              }
            );
            updatedCount++;
            console.log(`🔄 Updated: ${transformedData.title} (${transformedData.registration || 'No Reg'})`);
          } else {
            // Add new vehicle
            const newVehicle = new VehicleModel(transformedData);
            await newVehicle.save();
            addedCount++;
            console.log(`➕ Added: ${transformedData.title} (${transformedData.registration || 'No Reg'})`);
          }
        } catch (error) {
          console.error(`❌ Error processing vehicle ${transformedData.title}:`, error.message);
          skippedCount++;
        }
      }

      const result = {
        success: true,
        totalApiVehicles: allApiVehicles.length,
        publishedVehicles: apiVehicleMap.size,
        removed: removedCount,
        added: addedCount,
        updated: updatedCount,
        skipped: skippedCount,
        timestamp: new Date()
      };

      console.log('🎉 Full sync completed successfully!');
      console.log(`📈 Results: ${result.added} added, ${result.updated} updated, ${result.removed} removed, ${result.skipped} skipped`);
      
      return result;

    } catch (error) {
      console.error('❌ Full sync failed:', error.message);
      return { success: false, error: error.message };
    } finally {
      this.isRunning = false;
    }
  }

  async fetchAllPublishedVehicles() {
    const allVehicles = [];
    let page = 1;
    const pageSize = 20;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        console.log(`📄 Fetching page ${page}...`);
        const response = await this.autotraderAPI.getVehicles(page, pageSize);
        
        if (!response.vehicles || response.vehicles.length === 0) {
          hasMorePages = false;
          break;
        }

        // Filter out NOT_PUBLISHED vehicles
        const publishedVehicles = response.vehicles.filter(vehicle => {
          const advertiserAdvertStatus = vehicle.adverts?.retailAdverts?.advertiserAdvert?.status;
          return advertiserAdvertStatus !== 'NOT_PUBLISHED';
        });

        allVehicles.push(...publishedVehicles);
        console.log(`   Found ${publishedVehicles.length} published vehicles on page ${page}`);

        // Check if we have more pages
        if (response.vehicles.length < pageSize) {
          hasMorePages = false;
        } else {
          page++;
        }

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error fetching page ${page}:`, error.message);
        hasMorePages = false;
      }
    }

    return allVehicles;
  }

  async getSyncStatus() {
    const vehicleCount = await VehicleModel.countDocuments({ status: 'available' });
    return {
      isRunning: this.isRunning,
      vehicleCount: vehicleCount,
      lastSync: this.lastSyncTime
    };
  }
}

module.exports = FullSyncService;
