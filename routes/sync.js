const express = require('express');
const router = express.Router();
const EnhancedVehicleSyncService = require('../utils/enhancedVehicleSyncService');

// Initialize the enhanced sync service
const syncService = new EnhancedVehicleSyncService();

// Start automatic sync
router.post('/start', (req, res) => {
  try {
    syncService.startAutoSync();
    res.json({ 
      success: true, 
      message: 'Automatic sync started successfully',
      status: syncService.getSyncStatus()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Stop automatic sync
router.post('/stop', (req, res) => {
  try {
    syncService.stopAutoSync();
    res.json({ 
      success: true, 
      message: 'Automatic sync stopped successfully',
      status: syncService.getSyncStatus()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get sync status
router.get('/status', (req, res) => {
  try {
    const status = syncService.getSyncStatus();
    res.json({ 
      success: true, 
      status: status
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Force sync now
router.post('/force', async (req, res) => {
  try {
    const result = await syncService.forceSync();
    res.json({ 
      success: true, 
      message: 'Force sync completed',
      result: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
