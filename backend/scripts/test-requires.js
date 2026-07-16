const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Ignored
      } else {
        throw err;
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, '../src'));
const jsFiles = files.filter(f => f.endsWith('.js'));

let errors = [];

jsFiles.forEach(file => {
  try {
    require(file);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      errors.push({ file, error: err.message });
    }
  }
});

fs.writeFileSync(path.join(__dirname, 'require-errors.json'), JSON.stringify(errors, null, 2));
console.log(`Found ${errors.length} module resolution errors.`);
