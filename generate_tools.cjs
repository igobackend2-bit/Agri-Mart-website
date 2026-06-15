const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'public/catalog/tools');
const files = fs.readdirSync(toolsDir);

const products = files.map((file, index) => {
  const name = file.replace(/\.[^/.]+$/, ""); // remove extension
  return {
    id: `tools-${index + 1}`,
    name: name,
    displayName: name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${index + 1}`,
    brand: "IGO Farm Automation",
    category: "Precision Tools & Equipments",
    subcategory: "Tools",
    price: 499, // default placeholder
    mrp: 599,
    discount: 16,
    stock: 50,
    images: [`/catalog/tools/${file}`],
    description: `${name} — high-grade farm automation and precision equipment.`,
    composition: "Standard farm-grade material.",
    usage: "Use as directed for agricultural purposes.",
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 50) + 10,
    isIgoOwn: true,
    unit: "1 Unit",
    crops: ["All Crops"]
  };
});

fs.writeFileSync(path.join(__dirname, 'generated_tools.json'), JSON.stringify(products, null, 2));
console.log('Done generating tools JSON');
