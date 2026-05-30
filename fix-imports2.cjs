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
    .replace(/(?:from|import\()\s*['"](?:\.\.\/)+components\//g, (match) => match.startsWith('import(') ? "import('@/components/" : "from '@/components/")
    .replace(/(?:from|import\()\s*['"](?:\.\.\/)+src\//g, (match) => match.startsWith('import(') ? "import('@/src/" : "from '@/src/")
    .replace(/(?:from|import\()\s*['"](?:\.\.\/)+components['"]/g, (match) => match.startsWith('import(') ? "import('@/components'" : "from '@/components'")
    .replace(/(?:from|import\()\s*['"](?:\.\.\/)+src['"]/g, (match) => match.startsWith('import(') ? "import('@/src'" : "from '@/src'");
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    fixedCount++;
    console.log('Fixed imports in', file);
  }
});
console.log('Total files fixed:', fixedCount);
