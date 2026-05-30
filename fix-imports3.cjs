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
    .replace(/@\/components\/chemistry/g, "@/app/components/chemistry")
    .replace(/@\/components\/physics/g, "@/app/components/physics")
    .replace(/@\/components\/biology/g, "@/app/components/biology")
    .replace(/@\/components\/computer-science/g, "@/app/components/computer-science")
    .replace(/@\/components\/maths/g, "@/app/components/maths")
    .replace(/@\/components\/reactions/g, "@/app/components/reactions")
    
    // Also remove the onComplete={completeExperiment} which causes TS2322 error
    .replace(/\s*onComplete=\{completeExperiment\}/g, "");
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    fixedCount++;
    console.log('Fixed imports in', file);
  }
});
console.log('Total files fixed:', fixedCount);
