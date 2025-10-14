#!/usr/bin/env node

// Simple startup script for Azure debugging
console.log('🚀 Starting Merryfield Trading application...');
console.log('📁 Working directory:', process.cwd());
console.log('🔧 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || '3000');

try {
  // Import and start the main application
  require('./bin/www');
  console.log('✅ Application started successfully');
} catch (error) {
  console.error('❌ Failed to start application:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
