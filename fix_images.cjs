const fs = require('fs');

const files = [
  'src/pdfCatalogProducts.ts',
  'src/pastedCatalogProducts.ts',
  'src/marketplaceExpansionData.ts',
  'src/components/HomeComponent.tsx',
  'src/components/CategoryComponent.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  
  // This will find /catalog/... inside quotes and safely encodeURIComponent each segment
  code = code.replace(/(\/catalog\/[^\'\"\`]+)/g, (match) => {
    return './' + match.slice(1).split('/').map(seg => encodeURIComponent(decodeURIComponent(seg))).join('/');
  });
  
  fs.writeFileSync(f, code, 'utf8');
});

console.log('Fixed spaces in image paths safely');
