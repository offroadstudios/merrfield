const VehicleSyncService = require('./vehicleSyncService');
const VehicleModel = require('../models/VehicleModel');

class AutoSyncService {
  constructor() {
    this.vehicleSyncService = new VehicleSyncService();
    this.isRunning = false;
    this.lastSyncTime = null;
    this.syncInterval = 30 * 60 * 1000; // 30 minutes
  }

  async initialize() {
    console.log('Initializing Auto Sync Service...');
    
    // Run initial sync
    await this.syncVehicles();
    
    // Set up periodic sync
    setInterval(async () => {
      if (!this.isRunning) {
        await this.syncVehicles();
      }
    }, this.syncInterval);
    
    console.log('Auto Sync Service initialized');
  }

  async syncVehicles() {
    if (this.isRunning) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting auto sync...');

    try {
      const result = await this.vehicleSyncService.syncVehiclesFromAutotrader(20); // 20 vehicles per page
      this.lastSyncTime = new Date();
      
      console.log(`Auto sync completed: ${result.synced} vehicles synced, ${result.skipped} skipped`);
      
      return result;
    } catch (error) {
      console.error('Auto sync failed:', error.message);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  async getSyncStatus() {
    const vehicleCount = await VehicleModel.countDocuments({ status: 'available' });
    return {
      lastSyncTime: this.lastSyncTime,
      isRunning: this.isRunning,
      vehicleCount: vehicleCount,
      nextSyncIn: this.lastSyncTime ? 
        Math.max(0, this.syncInterval - (Date.now() - this.lastSyncTime.getTime())) : 0
    };
  }

  async forceSync() {
    console.log('Force sync requested...');
    return await this.syncVehicles();
  }
}

module.exports = AutoSyncService;
