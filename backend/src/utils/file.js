const path = require('path');
const fs = require('fs');

const getExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

module.exports = {
  getExtension,
  ensureDir,
};
