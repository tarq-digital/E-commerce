const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
dotenv.config();

const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

// Validate critical variables
if (!appConfig.port) {
  throw new Error('Application PORT is not defined.');
}

module.exports = appConfig;
