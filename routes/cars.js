const express = require('express');
const router = express.Router();
const VehicleModel = require('../models/VehicleModel');
const axios = require('axios');

// GET new cars page
router.get('/', async function (req, res) {
  try {
    res.render("cars_new.hbs");
  } catch (error) {
    console.error('Error rendering cars page:', error);
    res.status(500).render("error", { 
      message: "Error loading cars page",
      error: error.message 
    });
  }
});

// GET cars data as JSON
router.get('/data', async function (req, res) {
  try {
    const { limit = 50, page = 1 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const vehicles = await VehicleModel.find({})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalCount = await VehicleModel.countDocuments({});
    
    res.json({
      vehicles: vehicles,
      totalCount: totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasMore: pageNum < Math.ceil(totalCount / limitNum)
    });
  } catch (error) {
    console.error('Error fetching cars data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET specific car details
router.get('/details/:id', async function (req, res) {
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

// Proxy endpoint for API images
router.get('/image-proxy', async function (req, res) {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).send('Image URL required');
    }
    
    const response = await axios.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*',
        'Referer': 'https://api-sandbox.autotrader.co.uk/'
      },
      responseType: 'stream'
    });
    
    res.set({
      'Content-Type': response.headers['content-type'],
      'Cache-Control': 'public, max-age=3600'
    });
    
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying image:', error.message);
    res.status(404).send('Image not found');
  }
});

module.exports = router;
