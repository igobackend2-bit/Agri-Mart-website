const fs = require('fs');
const path = require('path');

const imgDir = path.join('d:', 'Igo-websites', 'Igo-AgriMart', 'public', 'catalog', 'Images');
const files = fs.readdirSync(imgDir);

let products = [];
let idCounter = 1000;

files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png|avif|webp)$/i)) {
        const name = path.basename(file, path.extname(file));
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
        
        let category = "Nursery Tools";
        
        products.push(`  {
    "id": "new-${idCounter}",
    "name": "${name.replace(/"/g, '\\"')}",
    "displayName": "${name.replace(/"/g, '\\"')}",
    "slug": "${slug}",
    "brand": "IGO Agri",
    "category": "${category}",
    "subcategory": "Accessories",
    "price": 199,
    "mrp": 250,
    "discount": 20,
    "stock": 100,
    "images": [
      "/catalog/Images/${file}"
    ],
    "description": "${name.replace(/"/g, '\\"')} — high quality, durable, and reliable.",
    "composition": "Standard material.",
    "usage": "Use as directed for gardening and nursery purposes.",
    "rating": 4.5,
    "reviewCount": 15,
    "isIgoOwn": false,
    "unit": "1 Pc",
    "crops": ["All Crops"]
  }`);
        idCounter++;
    }
});

const output = `\n// --- NEW PRODUCTS FROM /catalog/Images ---\n` + products.join(',\n') + `\n];\n`;
fs.writeFileSync('generated_new_products.txt', output);
console.log('Done!');
