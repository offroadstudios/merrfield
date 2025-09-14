const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');
const AutotraderAPI = require('../utils/autotraderAPI');

async function forceSyncWithImages() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db');
        console.log('Connected to MongoDB');

        // Initialize API
        const api = new AutotraderAPI();
        
        // Authenticate
        const authSuccess = await api.authenticate();
        if (!authSuccess) {
            throw new Error('Failed to authenticate with API');
        }

        // Get vehicles with images
        console.log('Fetching vehicles from API...');
        const response = await api.getVehicles(20, 1);
        console.log('API Response:', JSON.stringify(response, null, 2));

        if (response.vehicles && response.vehicles.length > 0) {
            console.log(`Found ${response.vehicles.length} vehicles`);
            
            // Process each vehicle
            for (let i = 0; i < response.vehicles.length; i++) {
                const vehicle = response.vehicles[i];
                console.log(`\nProcessing vehicle ${i + 1}:`, vehicle.vehicle?.make, vehicle.vehicle?.model);
                
                // Check if vehicle has media/images
                if (vehicle.media && vehicle.media.images && vehicle.media.images.length > 0) {
                    console.log(`Found ${vehicle.media.images.length} images for this vehicle`);
                    console.log('First image:', vehicle.media.images[0]);
                } else {
                    console.log('No images found for this vehicle');
                }
                
                // Transform vehicle data
                const transformedData = api.transformVehicleData(vehicle);
                console.log('Transformed data imagePath:', transformedData.imagePath);
                console.log('Transformed data images count:', transformedData.images?.length || 0);
                
                // Update or create vehicle in database
                const existingVehicle = await VehicleModel.findOne({ autotraderId: transformedData.autotraderId });
                if (existingVehicle) {
                    // Update existing vehicle
                    Object.assign(existingVehicle, transformedData);
                    existingVehicle.updatedAt = new Date();
                    await existingVehicle.save();
                    console.log(`Updated vehicle: ${transformedData.title}`);
                } else {
                    // Create new vehicle
                    const newVehicle = new VehicleModel(transformedData);
                    await newVehicle.save();
                    console.log(`Created vehicle: ${transformedData.title}`);
                }
            }
        } else {
            console.log('No vehicles found in API response');
        }

        console.log('Sync completed successfully');
    } catch (error) {
        console.error('Error during sync:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

forceSyncWithImages();
