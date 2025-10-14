const FullSyncService = require('./fullSyncService');

class AutomatedSyncScheduler {
  constructor() {
    this.fullSyncService = new FullSyncService();
    this.schedules = [
      { hour: 6, minute: 0, name: 'Morning Sync' },    // 6:00 AM
      { hour: 14, minute: 0, name: 'Afternoon Sync' }, // 2:00 PM  
      { hour: 22, minute: 0, name: 'Evening Sync' }    // 10:00 PM
    ];
    this.intervals = [];
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) {
      console.log('Scheduler already initialized');
      return;
    }

    console.log('🕐 Initializing automated sync scheduler...');
    console.log('📅 Sync schedule:');
    this.schedules.forEach(schedule => {
      console.log(`   - ${schedule.name}: ${schedule.hour.toString().padStart(2, '0')}:${schedule.minute.toString().padStart(2, '0')}`);
    });

    // Set up intervals for each scheduled time
    this.schedules.forEach(schedule => {
      const interval = this.setupSchedule(schedule);
      this.intervals.push(interval);
    });

    this.isInitialized = true;
    console.log('✅ Automated sync scheduler initialized');
  }

  setupSchedule(schedule) {
    return setInterval(async () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Check if it's time for this schedule
      if (currentHour === schedule.hour && currentMinute === schedule.minute) {
        console.log(`\n🕐 ${schedule.name} triggered at ${now.toISOString()}`);
        await this.runScheduledSync(schedule.name);
      }
    }, 60000); // Check every minute
  }

  async runScheduledSync(scheduleName) {
    try {
      console.log(`🚀 Starting ${scheduleName}...`);
      const result = await this.fullSyncService.performFullSync();
      
      if (result.success) {
        console.log(`✅ ${scheduleName} completed successfully`);
        console.log(`📊 Results: ${result.added} added, ${result.updated} updated, ${result.removed} removed`);
      } else {
        console.error(`❌ ${scheduleName} failed:`, result.error || result.message);
      }
    } catch (error) {
      console.error(`❌ ${scheduleName} error:`, error.message);
    }
  }

  async runManualSync() {
    console.log('🔧 Running manual sync...');
    return await this.fullSyncService.performFullSync();
  }

  stop() {
    console.log('🛑 Stopping automated sync scheduler...');
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.isInitialized = false;
    console.log('✅ Scheduler stopped');
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      schedules: this.schedules,
      syncServiceStatus: this.fullSyncService.getSyncStatus()
    };
  }
}

module.exports = AutomatedSyncScheduler;
