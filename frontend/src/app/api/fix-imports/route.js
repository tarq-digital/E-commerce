export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

export async function GET() {
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const appDir = path.join(srcDir, 'app');
    let modifications = [];
    let remainingErrors = [];

    const targets = ['components/', 'context/', 'utils/', 'lib/', 'hooks/', 'services/', 'styles/'];

    walkDir(appDir, (filePath) => {
      if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;

      let content = fs.readFileSync(filePath, 'utf-8');
      
      const importRegex = /from\s+['"](\.\.\/[^'"]+)['"]/g;
      let modified = false;

      content = content.replace(importRegex, (match, importPath) => {
        const targetMatch = targets.find(t => importPath.includes('/' + t) || importPath.includes('../' + t));
        if (!targetMatch) return match;

        const targetPart = importPath.substring(importPath.indexOf(targetMatch));
        
        const fileDir = path.dirname(filePath);
        let relativeToSrc = path.relative(fileDir, srcDir);
        if (relativeToSrc === '') relativeToSrc = '.';
        
        let correctImportPath = relativeToSrc + '/' + targetPart;
        correctImportPath = correctImportPath.replace(/\\/g, '/');
        if (!correctImportPath.startsWith('.')) correctImportPath = './' + correctImportPath;
        if (correctImportPath.startsWith('./../')) correctImportPath = correctImportPath.substring(2);

        if (importPath !== correctImportPath) {
          modifications.push({ file: filePath, incorrect: importPath, correct: correctImportPath });
          modified = true;
          return `from '${correctImportPath}'`;
        }
        return match;
      });

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    });

    return new Response(JSON.stringify({ success: true, modifications }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message, stack: err.stack }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
