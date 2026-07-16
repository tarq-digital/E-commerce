const path = require('path');
const appConfig = require('./app');

const logDirectory = path.join(__dirname, '../../logs');

const loggerConfig = {
  directory: logDirectory,
  level: appConfig.isDevelopment ? 'debug' : 'info',
  files: {
    app: path.join(logDirectory, 'app.log'),
    error: path.join(logDirectory, 'error.log'),
    requests: path.join(logDirectory, 'requests.log'),
    security: path.join(logDirectory, 'security.log'),
    audit: path.join(logDirectory, 'audit.log'),
  },
};

module.exports = loggerConfig;
