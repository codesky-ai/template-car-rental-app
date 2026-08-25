import dotenv from 'dotenv';
import app from './app';
import { testConnection } from './config/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.warn('⚠️  Server starting without database connection');
      console.warn('   Make sure MySQL is running and configured correctly');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Car Rental API Server running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📍 Cars API: http://localhost:${PORT}/api/cars`);

      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode enabled');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('
🛑 Received SIGINT. Graceful shutdown initiated...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('
🛑 Received SIGTERM. Graceful shutdown initiated...');
  process.exit(0);
});

// Start the server
startServer();