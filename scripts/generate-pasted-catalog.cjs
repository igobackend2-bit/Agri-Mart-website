const fs = require('fs');
const path = require('path');

const attachmentPath = process.argv[2];
if (!attachmentPath) {
  throw new Error('Usage: node scripts/generate-pasted-catalog.cjs <pasted-text-path>');
}

const source = fs.readFileSync(attachmentPath, 'utf8').replace(/\r\n/g, '\n');

const existingCategoryNames = new Set([
  'Fertilizers',
  'Bioproducts',
  'Seeds & Saplings',
  'Fresh Farm Produce',
  'Native Foods & Millets',
  'Indoor Plants',
  'Outdoor Plants & Trees',
  'Nursery & Garden Essentials',
  'Irrigation Systems',
  'Organic & Bio Inputs',
  'Post-Harvest & Storage',
  'Animal Husbandry',
  'Soil Health',
  'Farm Tools & Implements',
  'Crop Protection',
  'Growth Regulators',
  'Gardening Products',
  'Cattle & Bird Care',
  'Bulk Agri Supplies',
  'Agri Offers & Combos',
  'Pots & Planters',
  'Hydroponic Systems',
  'Grow Media & Substrates',
  'Germination Media',
  'Plant Support Materials',
  'Agriculture Trays',
  'Tanks & Reservoirs',
  'Pumps & Irrigation',
  'Grow Lights',
  'Garden Decor',
  'Turf & Grass',
]);

const headingMap = {
  SEEDS: { category: 'Seeds & Saplings', icon: 'Sprout' },
  'PLANTS & SAPLINGS': { category: 'Seeds & Saplings', icon: 'Sprout' },
  FERTILIZERS: { category: 'Fertilizers', icon: 'Leaf' },
  'CROP PROTECTION': { category: 'Crop Protection', icon: 'ShieldAlert' },
  IRRIGATION: { category: 'Irrigation Systems', icon: 'Droplets' },
  'FARM MACHINERY': { category: 'Farm Machinery', icon: 'Tractor' },
  'AGRICULTURAL TOOLS': { category: 'Farm Tools & Implements', icon: 'Wrench' },
  'GREENHOUSE & NURSERY': { category: 'Nursery & Garden Essentials', icon: 'Shovel' },
  HYDROPONICS: { category: 'Hydroponic Systems', icon: 'Droplets' },
  'DAIRY FARMING': { category: 'Animal Husbandry', icon: 'Beef' },
  'POULTRY FARMING': { category: 'Animal Husbandry', icon: 'Beef' },
  'GOAT & SHEEP FARMING': { category: 'Animal Husbandry', icon: 'Beef' },
  'FISHERIES & AQUACULTURE': { category: 'Animal Husbandry', icon: 'Beef' },
  BEEKEEPING: { category: 'Beekeeping', icon: 'Hexagon' },
  'MUSHROOM FARMING': { category: 'Mushroom Farming', icon: 'Sprout' },
  'FODDER & FEED': { category: 'Animal Husbandry', icon: 'Beef' },
  'VETERINARY PRODUCTS': { category: 'Animal Husbandry', icon: 'Beef' },
  FENCING: { category: 'Fencing', icon: 'Fence' },
  'POST HARVEST': { category: 'Post-Harvest & Storage', icon: 'Package' },
  'PACKAGING MATERIALS': { category: 'Packaging Materials', icon: 'Package' },
  'SOLAR AGRICULTURE': { category: 'Solar Agriculture', icon: 'Sun' },
  'PRECISION AGRICULTURE': { category: 'Precision Agriculture', icon: 'Satellite' },
  FORESTRY: { category: 'Forestry', icon: 'TreePine' },
  'RAW AGRICULTURAL PRODUCTS': { category: 'Fresh Farm Produce', icon: 'Wheat' },
  FRUITS: { category: 'Fresh Farm Produce', icon: 'Apple' },
  VEGETABLES: { category: 'Fresh Farm Produce', icon: 'Carrot' },
  PULSES: { category: 'Fresh Farm Produce', icon: 'Wheat' },
  'PROCESSED FARM PRODUCTS': { category: 'Native Foods & Millets', icon: 'Wheat' },
  'LAB & TESTING': { category: 'Lab & Testing', icon: 'FlaskConical' },
  'AGRICULTURAL SERVICES': { category: 'Agricultural Services', icon: 'Handshake' },
};

const imageByCategory = {
  'Seeds & Saplings': '/catalog/crop-care/Field%20Seeds/Paddy.webp',
  Fertilizers: '/catalog/crop-care/Chemical%20Fertilizers/UREA.webp',
  'Crop Protection': '/catalog/crop-care/powder/Copper%20Sulphate.jpeg',
  'Irrigation Systems': '/catalog/irrigation-systems/drip-irrigation.webp',
  'Farm Machinery': '/catalog/farm-tools/farm-tractor.webp',
  'Farm Tools & Implements': '/catalog/farm-tools/hand-tools.webp',
  'Nursery & Garden Essentials': '/catalog/nursery-essentials/seedling-tray.jpg',
  'Hydroponic Systems': '/catalog/nursery-essentials/Pots.png',
  'Animal Husbandry': '/catalog/animal-husbandry/cattle.webp',
  Beekeeping: '/catalog/organic-bio-inputs/neem-leaves.webp',
  'Mushroom Farming': '/catalog/farmer-factory-vegetables/ButtonMushrooms.jfif',
  Fencing: '/catalog/farm-tools/weeder.webp',
  'Post-Harvest & Storage': '/catalog/post-harvest-storage/grain-storage.webp',
  'Packaging Materials': '/catalog/post-harvest-storage/packing.webp',
  'Solar Agriculture': '/catalog/irrigation-systems/farm-irrigation.webp',
  'Precision Agriculture': '/catalog/soil-health/soil-testing.webp',
  Forestry: '/catalog/nursery-outdoor/TEAK.jfif',
  'Fresh Farm Produce': '/catalog/farmer-factory-vegetables/TomatoCountry.jfif',
  'Native Foods & Millets': '/catalog/farmer-factory-valluvam/FoxtailMillet.jpg',
  'Lab & Testing': '/catalog/soil-health/soil-testing.webp',
  'Agricultural Services': '/catalog/soil-health/soil-sample.webp',
};

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\b[a-z]/g, (match) => match.toUpperCase())
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bFor\b/g, 'for')
    .replace(/\b&\b/g, '&');
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function priceFor(category, index, name) {
  const base = {
    'Seeds & Saplings': 95,
    Fertilizers: 420,
    'Crop Protection': 360,
    'Irrigation Systems': 980,
    'Farm Machinery': 18500,
    'Farm Tools & Implements': 450,
    'Nursery & Garden Essentials': 260,
    'Hydroponic Systems': 1450,
    'Animal Husbandry': 720,
    Beekeeping: 1550,
    'Mushroom Farming': 650,
    Fencing: 1350,
    'Post-Harvest & Storage': 1750,
    'Packaging Materials': 360,
    'Solar Agriculture': 5400,
    'Precision Agriculture': 3200,
    Forestry: 180,
    'Fresh Farm Produce': 120,
    'Native Foods & Millets': 260,
    'Lab & Testing': 850,
    'Agricultural Services': 1200,
  }[category] || 399;
  const multiplier = 1 + (index % 7) * 0.17;
  const seedBoost = /hybrid|organic|solar|drone|machine|tractor|harvester|storage|testing/i.test(name) ? 1.45 : 1;
  return Math.round((base * multiplier * seedBoost) / 5) * 5;
}

function unitFor(category, name) {
  if (/service|consultancy|testing|rental|spraying|storage|transport/i.test(name)) return '1 service booking';
  if (/seed|lure|tag|label|tray|bag|box|net|suit|frame|sheet/i.test(name)) return '1 pack';
  if (/plant|sapling|tree|goat|sheep|cattle|bird|chick|fingerling|colony/i.test(name)) return '1 unit';
  if (/pump|tractor|tiller|harvester|sprayer|machine|meter|station|drone|controller/i.test(name)) return '1 piece';
  if (category === 'Fresh Farm Produce' || category === 'Native Foods & Millets') return '1 kg';
  if (category === 'Fertilizers' || category === 'Crop Protection' || category === 'Animal Husbandry') return '1 pack';
  return '1 unit';
}

function problemFilterFor(category, heading) {
  if (category === 'Crop Protection') return 'Pest Control';
  if (category === 'Fertilizers' || category === 'Lab & Testing') return 'Soil Health';
  if (heading.includes('POST') || heading.includes('PACKAGING')) return 'Disease Control';
  return 'Growth Boosters';
}

const groups = [];
let current = null;
for (const rawLine of source.split('\n')) {
  const line = rawLine.trim();
  if (!line) continue;
  if (line === line.toUpperCase() && !line.endsWith('Seeds') && headingMap[line]) {
    current = { heading: line, products: [] };
    groups.push(current);
  } else if (current) {
    current.products.push(line);
  }
}

const products = [];
const newCategoryCounts = new Map();
let productIndex = 1;

for (const group of groups) {
  const meta = headingMap[group.heading];
  for (const rawName of group.products) {
    const displayName = titleCase(rawName);
    const category = meta.category;
    const price = priceFor(category, productIndex, displayName);
    const mrp = Math.round(price * 1.22);
    const slug = slugify(displayName);
    products.push({
      id: `pt-${String(productIndex).padStart(3, '0')}`,
      name: `IGO AgriMart ${displayName}`,
      displayName,
      slug,
      brand: 'IGO AgriMart',
      category,
      subcategory: titleCase(group.heading),
      price,
      mrp,
      discount: Math.round(((mrp - price) / mrp) * 100),
      stock: 50 + (productIndex % 10) * 13,
      images: [imageByCategory[category] || '/catalog/organic-bio-inputs/organic-farming.webp'],
      description: `${displayName} is part of the expanded IGO AgriMart catalog, added from the complete product taxonomy for seeds, inputs, farm equipment, livestock, fresh produce, services and agri-infrastructure.`,
      composition: `${displayName} supplied under IGO AgriMart quality checks. Exact pack size, material or active ingredient can be finalized per supplier listing.`,
      usage: category === 'Agricultural Services'
        ? 'Book the service through IGO AgriMart and share crop, acreage and location details for a tailored quotation.'
        : 'Use as per label, crop stage and local agronomist recommendation. Store in a clean, dry place away from direct sunlight.',
      rating: Number((4.1 + (productIndex % 8) / 10).toFixed(1)),
      reviewCount: 24 + (productIndex * 19) % 510,
      isIgoOwn: true,
      problemFilter: problemFilterFor(category, group.heading),
      tags: [slugify(group.heading), slugify(category), ...slug.split('-').slice(0, 3)],
      unit: unitFor(category, displayName),
      isOrganic: /organic|bio|neem|compost|manure|vermicompost|herbal/i.test(displayName),
      crops: ['All crops'],
      certifications: [
        {
          name: category === 'Crop Protection' ? 'Label compliance required' : 'IGO Quality Checked',
          issuer: 'IGO AgriMart',
          isVerified: true,
        },
      ],
    });
    if (!existingCategoryNames.has(category)) {
      newCategoryCounts.set(category, (newCategoryCounts.get(category) || 0) + 1);
    }
    productIndex += 1;
  }
}

const newCategories = Array.from(newCategoryCounts, ([name, count]) => ({
  id: `pt-${slugify(name)}`,
  name,
  slug: slugify(name),
  icon: Object.values(headingMap).find((item) => item.category === name)?.icon || 'Package',
  productCount: count,
}));

const file = `import { Category, Product } from './types';

export const PASTED_CATALOG_CATEGORIES: Category[] = ${JSON.stringify(newCategories, null, 2)};

export const PASTED_CATALOG_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'pastedCatalogProducts.ts'), file);
console.log(`Generated ${products.length} products and ${newCategories.length} new categories.`);
