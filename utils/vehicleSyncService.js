const AutotraderAPI = require('./autotraderAPI');
const VehicleModel = require('../models/VehicleModel');

class VehicleSyncService {
  constructor() {
    this.autotraderAPI = new AutotraderAPI();
  }

  async syncVehiclesFromAutotrader(limit = 20) {
    try {
      console.log('Starting vehicle sync from Autotrader API...');
      
      // Fetch vehicles from Autotrader API (page 1, with specified limit)
      const apiResponse = await this.autotraderAPI.getVehicles(1, limit);
      
      if (!apiResponse || (!apiResponse.vehicles && !apiResponse.data)) {
        console.log('No vehicles found in API response');
        return { success: false, message: 'No vehicles found in API response' };
      }

      const vehicles = apiResponse.vehicles || apiResponse.data || [];
      console.log(`Found ${vehicles.length} vehicles from Autotrader API`);

      let syncedCount = 0;
      let skippedCount = 0;

      for (const vehicleData of vehicles) {
        try {
          // Transform the data to match our schema
          const transformedData = this.autotraderAPI.transformVehicleData(vehicleData);
          
          // Skip vehicles that are filtered out (e.g., NOT_PUBLISHED status)
          if (!transformedData) {
            skippedCount++;
            continue;
          }
          
          // Check if vehicle already exists (by autotraderId)
          const existingVehicle = await VehicleModel.findOne({ 
            autotraderId: transformedData.autotraderId 
          });

          if (existingVehicle) {
            // Update existing vehicle
            await VehicleModel.findByIdAndUpdate(
              existingVehicle._id,
              { ...transformedData, status: 'available', updatedAt: new Date() },
              { new: true }
            );
            console.log(`Updated existing vehicle: ${transformedData.title}`);
            syncedCount++;
          } else {
            // Create new vehicle with unique ID
            const uniqueId = `${transformedData.autotraderId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const newVehicle = new VehicleModel({
              ...transformedData, 
              status: 'available',
              autotraderId: uniqueId
            });
            await newVehicle.save();
            console.log(`Added new vehicle: ${transformedData.title}`);
            syncedCount++;
          }
        } catch (vehicleError) {
          console.error(`Error processing vehicle ${vehicleData.id}:`, vehicleError.message);
          skippedCount++;
        }
      }

      console.log(`Sync completed: ${syncedCount} vehicles synced, ${skippedCount} skipped`);
      return {
        success: true,
        synced: syncedCount,
        skipped: skippedCount,
        total: vehicles.length
      };

    } catch (error) {
      console.error('Error syncing vehicles from Autotrader API:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async getVehiclesByBodyType(bodyType, limit = 20, skip = 0) {
    try {
      const vehicles = await VehicleModel.find({ 
        bodyType: bodyType
        // Removed status filter temporarily
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

      console.log(`Found ${vehicles.length} ${bodyType} vehicles in database (skip: ${skip}, limit: ${limit})`);
      return vehicles;
    } catch (error) {
      console.error(`Error fetching vehicles by body type ${bodyType}:`, error.message);
      throw error;
    }
  }

  async getAllVehicles(limit = 50, skip = 0) {
    try {
      const vehicles = await VehicleModel.find({}) // Removed status filter temporarily
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

      console.log(`Found ${vehicles.length} vehicles in database (skip: ${skip}, limit: ${limit})`);
      return vehicles;
    } catch (error) {
      console.error('Error fetching all vehicles:', error.message);
      throw error;
    }
  }

  async getVehiclesByBrand(brand, limit = 20) {
    try {
      const vehicles = await VehicleModel.find({ 
        brand: { $regex: new RegExp(brand, 'i') },
        status: 'available'
      })
      .sort({ updatedAt: -1 })
      .limit(limit);

      return vehicles;
    } catch (error) {
      console.error(`Error fetching vehicles by brand ${brand}:`, error.message);
      throw error;
    }
  }

  async searchVehicles(searchParams) {
    try {
      const {
        bodyType,
        brand,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        transmission,
        fuelType,
        minMileage,
        maxMileage,
        sortBy = 'updatedAt',
        sortOrder = -1,
        limit = 20
      } = searchParams;

      let query = { status: 'available' };

      if (bodyType) query.bodyType = bodyType;
      if (brand) query.brand = { $regex: new RegExp(brand, 'i') };
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }
      if (minYear || maxYear) {
        query.year = {};
        if (minYear) query.year.$gte = minYear;
        if (maxYear) query.year.$lte = maxYear;
      }
      if (transmission) query.transmission = transmission;
      if (fuelType) query.fuelType = fuelType;
      if (minMileage || maxMileage) {
        query.mileage = {};
        if (minMileage) query.mileage.$gte = minMileage;
        if (maxMileage) query.mileage.$lte = maxMileage;
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder;

      const vehicles = await VehicleModel.find(query)
        .sort(sortOptions)
        .limit(limit);

      return vehicles;
    } catch (error) {
      console.error('Error searching vehicles:', error.message);
      throw error;
    }
  }

  async getBodyTypeStats() {
    try {
      const stats = await VehicleModel.aggregate([
        { $match: { status: 'available' } },
        { $group: { 
          _id: '$bodyType', 
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }},
        { $sort: { count: -1 } }
      ]);

      return stats;
    } catch (error) {
      console.error('Error getting body type stats:', error.message);
      throw error;
    }
  }
}

module.exports = VehicleSyncService;
