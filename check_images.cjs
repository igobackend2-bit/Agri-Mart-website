const fs = require('fs');

const check = (file) => {
  if (!fs.existsSync('src/' + file)) return;
  const code = fs.readFileSync('src/' + file, 'utf8');
  
  const localUrls = code.match(/'\/catalog\/[^']+'/g) || code.match(/"\/catalog\/[^"]+"/g);
  if(localUrls) {
    const unique = [...new Set(localUrls)].map(u => u.slice(1, -1));
    const missing = unique.filter(u => !fs.existsSync('public' + decodeURIComponent(u)));
    if(missing.length > 0) {
      console.log(file, 'Missing files:', missing.length, missing.slice(0, 3));
    } else {
      console.log(file, 'All', unique.length, 'local images exist.');
    }
  } else {
    console.log(file, 'No local images.');
  }
};

['pdfCatalogProducts.ts', 'pastedCatalogProducts.ts', 'marketplaceExpansionData.ts', 'seedData.ts', 'realCatalogData.generated.ts'].forEach(check);
