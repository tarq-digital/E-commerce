const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', '(admin)', 'login');

if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`Successfully deleted ${targetPath}`);
} else {
    console.log(`${targetPath} does not exist.`);
}
