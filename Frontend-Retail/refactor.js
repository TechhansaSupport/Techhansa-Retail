const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if file uses fetch and import.meta.env.VITE_API_BASE_URL (meaning it's an API call)
  // We want to avoid replacing fetch for external APIs, but mostly they are our APIs.
  if (content.includes('fetch(') && !file.includes('utils\\\\api.js') && !file.includes('utils/api.js')) {
    
    // Replace fetch( with fetchWithAuth(
    // We have to be careful not to replace things like `refetch()` or similar
    let newContent = content.replace(/\bfetch\(/g, 'fetchWithAuth(');
    
    // Add import statement at the top if changed
    if (newContent !== content) {
      // Find out relative path to utils/api.js
      const relativePath = path.relative(path.dirname(file), path.join(srcDir, 'utils', 'api.js')).replace(/\\/g, '/');
      const importStatement = `import { fetchWithAuth } from '${relativePath.startsWith('.') ? relativePath : './' + relativePath}';\n`;
      
      // Insert after last import, or at top
      const lastImportIndex = newContent.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = newContent.indexOf('\n', lastImportIndex);
        newContent = newContent.slice(0, endOfLastImport + 1) + importStatement + newContent.slice(endOfLastImport + 1);
      } else {
        newContent = importStatement + newContent;
      }
      
      fs.writeFileSync(file, newContent, 'utf8');
      changedFiles++;
      console.log(`Updated ${file}`);
    }
  }
});

console.log(`Refactoring complete. Changed ${changedFiles} files.`);
