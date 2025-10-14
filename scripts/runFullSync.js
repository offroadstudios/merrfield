const FullSyncService = require('../utils/fullSyncService');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/autorizz-db?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

async function runFullSync() {
  try {
    console.log('🚀 Starting manual full sync...');
    
    const syncService = new FullSyncService();
    const result = await syncService.performFullSync();
    
    if (result.success) {
      console.log('\n🎉 Full sync completed successfully!');
      console.log('📊 Summary:');
      console.log(`   - Total API vehicles: ${result.totalApiVehicles}`);
      console.log(`   - Published vehicles: ${result.publishedVehicles}`);
      console.log(`   - Added: ${result.added}`);
      console.log(`   - Updated: ${result.updated}`);
      console.log(`   - Removed: ${result.removed}`);
      console.log(`   - Skipped: ${result.skipped}`);
      console.log(`   - Timestamp: ${result.timestamp}`);
    } else {
      console.error('❌ Full sync failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error running full sync:', error);
  } finally {
    mongoose.disconnect();
  }
}

runFullSync();
