const express = require('express');
const router = express.Router();
const VehicleSyncService = require('../utils/vehicleSyncService');
const VehicleModel = require('../models/VehicleModel');

const vehicleSyncService = new VehicleSyncService();

router.use(express.static("public"));

// GET all vehicles or filter by body type
router.get('/', async function (req, res) {
  try {
    console.log('VEHICLES ROUTE HIT - /vehicles/');
    const { bodyType, limit = 50, page = 1, format } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let vehicles;
    let totalCount;
    
    if (bodyType) {
      vehicles = await vehicleSyncService.getVehiclesByBodyType(bodyType, limitNum, skip);
      totalCount = await VehicleModel.countDocuments({ bodyType: bodyType });
    } else {
      vehicles = await vehicleSyncService.getAllVehicles(limitNum, skip);
      totalCount = await VehicleModel.countDocuments({});
    }

    console.log(`Fetched ${vehicles.length} vehicles for bodyType: ${bodyType || 'All'} (page ${pageNum})`);
    console.log('Total count:', totalCount);

    // If AJAX request, return JSON
    if (format === 'json') {
      return res.json({
        vehicles: vehicles,
        totalCount: totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        hasMore: pageNum < Math.ceil(totalCount / limitNum)
      });
    }

    res.render("vehicles_index.hbs", { 
      vehicles: vehicles,
      bodyType: bodyType || 'All',
      totalCount: totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasMore: pageNum < Math.ceil(totalCount / limitNum),
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).render("error", { 
      message: "Error fetching vehicles",
      error: error.message 
    });
  }
});

// GET vehicles by specific body type
router.get('/:bodyType', async function (req, res) {
  try {
    const { bodyType } = req.params;
    const { limit = 20, page = 1, format } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const vehicles = await vehicleSyncService.getVehiclesByBodyType(bodyType, limitNum, skip);
    const totalCount = await VehicleModel.countDocuments({ bodyType: bodyType, status: 'available' });
    
    console.log(`Fetched ${vehicles.length} ${bodyType} vehicles (page ${pageNum})`);

    // If AJAX request, return JSON
    if (format === 'json') {
      return res.json({
        vehicles: vehicles,
        totalCount: totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        hasMore: pageNum < Math.ceil(totalCount / limitNum)
      });
    }
    
    res.render("vehicles_index.hbs", { 
      vehicles: vehicles,
      bodyType: bodyType,
      totalCount: totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasMore: pageNum < Math.ceil(totalCount / limitNum),
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.bodyType} vehicles:`, error);
    res.status(500).render("error", { 
      message: `Error fetching ${req.params.bodyType} vehicles`,
      error: error.message 
    });
  }
});

// GET filtered vehicles
router.get('/:bodyType/filter', async function (req, res) {
  try {
    const { bodyType } = req.params;
    const searchParams = {
      bodyType: bodyType,
      ...req.query
    };

    const vehicles = await vehicleSyncService.searchVehicles(searchParams);
    
    res.render("vehicles_index.hbs", { 
      vehicles: vehicles,
      bodyType: bodyType,
      totalCount: vehicles.length,
      filters: req.query
    });
  } catch (error) {
    console.error(`Error filtering ${req.params.bodyType} vehicles:`, error);
    res.status(500).render("error", { 
      message: `Error filtering ${req.params.bodyType} vehicles`,
      error: error.message 
    });
  }
});

// GET specific vehicle details
router.get('/:bodyType/details/:id', async function (req, res) {
  try {
    const { id } = req.params;
    
    const vehicle = await VehicleModel.findById(id);
    
    if (!vehicle) {
      return res.status(404).render("error", { 
        message: "Vehicle not found",
        error: "The requested vehicle could not be found" 
      });
    }

    res.render("vehicle_details.hbs", { 
      vehicle: vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    res.status(500).render("error", { 
      message: "Error fetching vehicle details",
      error: error.message 
    });
  }
});

// GET booking page for specific vehicle
router.get('/:bodyType/book/:id', async function (req, res) {
  try {
    const { id } = req.params;
    
    const vehicle = await VehicleModel.findById(id);
    
    if (!vehicle) {
      return res.status(404).render("error", { 
        message: "Vehicle not found",
        error: "The requested vehicle could not be found" 
      });
    }

    res.render("vehicle_booking.hbs", { 
      vehicle: vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle for booking:', error);
    res.status(500).render("error", { 
      message: "Error fetching vehicle for booking",
      error: error.message 
    });
  }
});

// POST sync vehicles from Autotrader API
router.post('/sync', async function (req, res) {
  try {
    const { limit = 10 } = req.body;
    
    const result = await vehicleSyncService.syncVehiclesFromAutotrader(parseInt(limit));
    
    res.json(result);
  } catch (error) {
    console.error('Error syncing vehicles:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET body type statistics
router.get('/stats/bodytypes', async function (req, res) {
  try {
    const stats = await vehicleSyncService.getBodyTypeStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching body type stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
