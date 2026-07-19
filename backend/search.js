const fs = require('fs');
const path = require('path');

function searchDirectory(dir, results = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            searchDirectory(fullPath, results);
        } else if (stat.isFile() && fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('product_variant_id')) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

module.exports = () => searchDirectory(path.join(__dirname, 'src'));
