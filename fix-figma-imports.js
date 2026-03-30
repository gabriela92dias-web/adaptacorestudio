import fs from 'fs';
import path from 'path';

const files = [
  'imports/Rotulos031.tsx',
  'imports/NovosRotulosAdaptaCann1-235-30.tsx',
  'imports/Rotulos021.tsx',
  'imports/NovosRotulosAdaptaCann1.tsx',
  'branchtestee/imports/NovosRotulosAdaptaCann1-235-30.tsx',
  'branchtestee/imports/NovosRotulosAdaptaCann1.tsx',
  'branchtestee/imports/Rotulos021.tsx',
  'branchtestee/imports/Rotulos031.tsx',
  'branchtestee/imports/Rotulos011.tsx'
];

files.forEach(file => {
  const fullPath = path.resolve(file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Remove the import statements
  content = content.replace(/import imgRectangle.*from "figma:asset.*";/g, '');
  content = content.replace(/import imgRectangle1.*from "figma:asset.*";/g, '');
  
  // Replace the src usage
  content = content.replace(/src=\{imgRectangle\}/g, 'src={""}');
  content = content.replace(/src=\{imgRectangle1\}/g, 'src={""}');
  
  fs.writeFileSync(fullPath, content, 'utf-8');
});
console.log('Fixed figma assets!');
