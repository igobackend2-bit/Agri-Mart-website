const fs = require('fs');

// 1. Fix igoExtraProducts.ts
let igoExtra = fs.readFileSync('src/igoExtraProducts.ts', 'utf8');

// Fix Vegetable Seeds
const seedMap = {
  'Tomato': '/catalog/crop-care/Vegetables/Tomato_Seeds.png',
  'Chilli': '/catalog/crop-care/Vegetables/Chilli_Seeds.png',
  'Brinjal': '/catalog/crop-care/Vegetables/Brinjal.png',
  'Okra': '/catalog/crop-care/Vegetables/Ladiesfinger.png',
  'Cucumber': '/catalog/crop-care/Vegetables/Cucumber.png',
  'Bitter Gourd': '/catalog/crop-care/Vegetables/Bitter Guard.png',
  'Pumpkin': '/catalog/crop-care/Vegetables/Pumpkin.png',
};

// Generic seed packet for others
const genericSeed = '/catalog/crop-care/Vegetables/Tomato_Seeds.png';

// Replace images for Vegetable Seeds
igoExtra = igoExtra.replace(/\{\s*"id":\s*"igox-[^"]+",[\s\S]*?"category":\s*"Vegetable Seeds",[\s\S]*?"images":\s*\[\s*"([^"]+)"\s*\]/g, (match, p1) => {
  let matchedImage = genericSeed;
  for (const key in seedMap) {
    if (match.includes(`"crops": [\n      "${key}"\n    ]`)) {
      matchedImage = seedMap[key];
      break;
    }
  }
  return match.replace(`"${p1}"`, `"${matchedImage}"`);
});

// Fix Fruit Plants
const plantMap = {
  'Alphonso Mango': '/catalog/nursery-outdoor/Mango_Plant.png',
  'Banganapalli Mango': '/catalog/nursery-outdoor/Mango_Plant.png',
  'G9 Banana': '/catalog/nursery-outdoor/Mango_Plant.png',
  'Red Banana': '/catalog/nursery-outdoor/Mango_Plant.png',
  'Guava': '/catalog/nursery-outdoor/JAMUN.jpg',
  'Papaya': '/catalog/nursery-outdoor/Papaya_Plant.png',
  'Pomegranate': '/catalog/nursery-outdoor/ARJUN.jpg',
  'Sapota': '/catalog/nursery-outdoor/NEEM.jfif',
  'Lemon': '/catalog/nursery-outdoor/LEMON.webp',
  'Sweet Lime': '/catalog/nursery-outdoor/LEMON.webp',
  'Orange': '/catalog/nursery-outdoor/LEMON.webp',
  'Amla': '/catalog/nursery-outdoor/ARJUN.jpg',
  'Dragon Fruit': '/catalog/nursery-outdoor/Papaya_Plant.png',
  'Pineapple': '/catalog/nursery-outdoor/Papaya_Plant.png',
  'Strawberry': '/catalog/nursery-outdoor/Papaya_Plant.png',
  'Apple': '/catalog/nursery-outdoor/Mango_Plant.png',
  'Kiwi': '/catalog/nursery-outdoor/Mango_Plant.png',
  'Muskmelon': '/catalog/nursery-outdoor/Papaya_Plant.png',
  'Watermelon': '/catalog/nursery-outdoor/Papaya_Plant.png',
};

igoExtra = igoExtra.replace(/\{\s*"id":\s*"igox-[^"]+",[\s\S]*?"category":\s*"Fruit Plants",[\s\S]*?"images":\s*\[\s*"([^"]+)"\s*\]/g, (match, p1) => {
  let matchedImage = '/catalog/nursery-outdoor/Mango_Plant.png';
  for (const key in plantMap) {
    if (match.includes(`"${key} Plant`)) {
      matchedImage = plantMap[key];
      break;
    }
  }
  return match.replace(`"${p1}"`, `"${matchedImage}"`);
});

fs.writeFileSync('src/igoExtraProducts.ts', igoExtra, 'utf8');

// 2. Fix pastedCatalogProducts.ts
let pastedCatalog = fs.readFileSync('src/pastedCatalogProducts.ts', 'utf8');

// Fix pt-343 (Grapes)
pastedCatalog = pastedCatalog.replace(/("id":\s*"pt-343",[\s\S]*?"images":\s*\[\s*)"\/catalog\/farmer-factory-valluvam\/DryGrapesBlack\.jpg"/, '$1"/catalog/farmer-factory-fruits/Grapes_Fruit.png"');

// Fix pt-348 (Jackfruit)
pastedCatalog = pastedCatalog.replace(/("id":\s*"pt-348",[\s\S]*?"images":\s*\[\s*)"\/catalog\/farmer-factory-fruits\/GuavaWhite\.jfif"/, '$1"/catalog/farmer-factory-fruits/Jackfruit.png"');

fs.writeFileSync('src/pastedCatalogProducts.ts', pastedCatalog, 'utf8');

console.log("Images fixed in igoExtraProducts.ts and pastedCatalogProducts.ts");
