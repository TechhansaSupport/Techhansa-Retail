const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Replace raw 'http://localhost:5000...' strings with template literals using env
    content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_API_BASE_URL}$1`');
    
    // 2. Replace http://localhost:5000 inside existing template literals
    content = content.replace(/http:\/\/localhost:5000/g, '${import.meta.env.VITE_API_BASE_URL}');

    // 3. For Admin pages, we need to inject the authenticated axios instance
    if (filePath.includes('portal\\Admin\\Pages')) {
      content = content.replace(/import axios from ['"]axios['"];?/g, "import axios from '../../../api/axios';");
      // Since our new axios instance handles baseURL, we can actually strip the base url completely from axios calls
      content = content.replace(/\$\{import\.meta\.env\.VITE_API_BASE_URL\}/g, '');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  }
});
console.log('Refactoring complete.');
