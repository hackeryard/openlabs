const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'app', 'labs'));
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/components/g, "from '@/components")
    .replace(/from\s+['"]\.\.\/\.\.\/\.\.\/components/g, "from '@/components")
    .replace(/from\s+['"]\.\.\/\.\.\/components/g, "from '@/components")
    .replace(/from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/src/g, "from '@/src")
    .replace(/from\s+['"]\.\.\/\.\.\/\.\.\/src/g, "from '@/src")
    .replace(/from\s+['"]\.\.\/\.\.\/src/g, "from '@/src");
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    fixedCount++;
    console.log('Fixed imports in', file);
  }
});
console.log('Total files fixed:', fixedCount);
