const dotenv = require('dotenv');
dotenv.config();

const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

if (!jwtConfig.accessSecret || !jwtConfig.refreshSecret) {
  throw new Error('JWT secrets are missing from environment variables.');
}

module.exports = jwtConfig;
