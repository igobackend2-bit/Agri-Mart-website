// One-off generation script: scans /public/catalog and emits a TypeScript SEED data module
// (categories + products) built from REAL product images sourced from sibling Igo- project
// folders (Crop Care, Farmer Factory, Nursery). Run with: node generate-catalog.cjs
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CATALOG_DIR = path.join(ROOT, 'public', 'catalog');
const OUT_FILE = path.join(ROOT, 'src', 'realCatalogData.generated.ts');

// ---------- helpers ----------
function seeded(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }
function intIn(rnd, lo, hi) { return Math.floor(lo + rnd() * (hi - lo + 1)); }
function round5(n) { return Math.round(n / 5) * 5; }

function titleCase(raw) {
  let n = raw.replace(/\.[a-zA-Z0-9]+$/, '');
  n = n.replace(/[_]+/g, ' ');
  n = n.replace(/\(/g, ' (').replace(/\)/g, ') ');
  n = n.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  n = n.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  n = n.replace(/\s+/g, ' ').trim();
  // Title-case each word but preserve all-caps tokens like NPK, UAN, DAP, CAN
  n = n.split(' ').map(w => {
    if (/^[A-Z0-9().%-]+$/.test(w) && w.length > 1) return w; // keep e.g. NPK, UAN, 20%, (CAN)
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
  return n.trim();
}

// Cleans up messy marketplace-style filenames (eBay listing titles, prices, years,
// repeated phrases, trailing ellipses) into a presentable product name.
function cleanProductName(raw) {
  let n = raw;
  n = n.replace(/\bAd\s*E\s*Bay\b/gi, '');
  n = n.replace(/[$₹]\s?\d[\d.,]*\s*\d*/g, '');
  n = n.replace(/\b(19|20)\d{2}\b/g, '');
  n = n.replace(/\.\.\.+/g, '');
  n = n.replace(/\bNew\b\s*/gi, '');
  n = n.replace(/\s{2,}/g, ' ').trim();
  // collapse immediately-repeated single words ("Pole Coir Moss Totem Pole Coir Moss Stick" -> dedupe runs)
  const words = n.split(' ').filter(Boolean);
  const out = [];
  for (let i = 0; i < words.length; i++) {
    if (i >= 2 && words[i].toLowerCase() === words[i - 2].toLowerCase() && words[i - 1].toLowerCase() === words[i + 1]?.toLowerCase()) {
      continue; // skip start of a repeating 2-word phrase
    }
    out.push(words[i]);
  }
  n = out.join(' ').replace(/\s{2,}/g, ' ').trim();
  n = n.replace(/[-,]\s*$/, '').trim();
  // truncate to a clean word boundary under ~62 chars
  if (n.length > 62) {
    const cut = n.slice(0, 62);
    const lastSpace = cut.lastIndexOf(' ');
    n = (lastSpace > 30 ? cut.slice(0, lastSpace) : cut).trim();
  }
  return n.trim();
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/[()%]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ---------- category + content blueprints ----------
// Each blueprint maps a source folder to: target category, subcategory label,
// brand pool, price range, unit template, description/usage generators, tags, flags.
const BLUEPRINTS = {
  'crop-care/Chemical Fertilizers': {
    category: 'Fertilizers', subcategory: 'Chemical Fertilizers',
    brands: ['Coromandel', 'Tata Rallis', 'IGO Fertigation'],
    price: [320, 1450], unit: (rnd) => `${pick(rnd, [25, 50])} kg bag`,
    isOrganic: false, problemFilter: 'Soil Health',
    desc: (n) => `${n} is a high-purity granular fertilizer formulated to correct nutrient deficiencies and boost vigorous vegetative growth across major field and horticultural crops. Sourced from IGO's certified chemical fertilizer partners and quality-checked before dispatch.`,
    composition: (n) => `${n} — industrial grade, FCO 1985 compliant nutrient salt, water-soluble formulation.`,
    usage: () => 'Apply as basal dose or top-dressing per soil-test recommendation; always wear gloves and avoid contact with eyes. Store in a cool, dry place away from direct sunlight.',
    tags: (n) => ['fertilizer', 'chemical-fertilizer', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'crop-care/Organic Fertilizers': {
    category: 'Bioproducts', subcategory: 'Organic Fertilizers',
    brands: ['IGO Bio Solutions', 'Farmers Factory', 'IGO Greenhouse'],
    price: [180, 750], unit: (rnd) => `${pick(rnd, [5, 10, 25])} kg pack`,
    isOrganic: true, problemFilter: 'Soil Health',
    desc: (n) => `${n} is a natural soil conditioner that improves microbial activity, water retention and long-term soil fertility — an essential input for organic and regenerative farming systems promoted across the IGO network.`,
    composition: (n) => `${n} — fully composted organic matter, pathogen-free, screened for uniform particle size.`,
    usage: () => 'Mix into topsoil before sowing or apply as mulch around root zones; ideal as a base layer beneath chemical top-dressing for balanced nutrition.',
    tags: (n) => ['organic', 'compost', 'soil-health', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'crop-care/liquid': {
    category: 'Fertilizers', subcategory: 'Liquid Nutrients',
    brands: ['Multiplex', 'IGO Precision Farming', 'IGO Fertigation'],
    price: [220, 980], unit: (rnd) => `${pick(rnd, [500, 1000])} ml bottle`,
    isOrganic: false, problemFilter: 'Growth Boosters',
    desc: (n) => `${n} is a fast-absorbing liquid nutrient concentrate designed for foliar spray and fertigation systems — delivers nutrients directly to the plant for rapid correction of deficiencies and visible growth response within days.`,
    composition: (n) => `${n} — chelated, water-soluble liquid concentrate suitable for drip and foliar application.`,
    usage: () => 'Dilute as per the label dosage chart (typically 2-5 ml per litre of water) and spray during early morning or evening hours; compatible with most drip fertigation systems.',
    tags: (n) => ['liquid-fertilizer', 'fertigation', 'foliar-spray', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'crop-care/powder': {
    category: 'Fertilizers', subcategory: 'Powder & Micronutrients',
    brands: ['Tata Rallis', 'Coromandel', 'IGO Fertigation', 'Multiplex'],
    price: [160, 890], unit: (rnd) => `${pick(rnd, [250, 500, 1000])} g pack`,
    isOrganic: false, problemFilter: 'Soil Health',
    desc: (n) => `${n} is a finely milled, water-soluble powder nutrient that corrects specific micronutrient deficiencies quickly — popular among IGO partner farmers for tank-mixing with irrigation water or foliar sprays.`,
    composition: (n) => `${n} — 100% water-soluble crystalline powder, lab-tested for purity and solubility.`,
    usage: () => 'Dissolve completely in water before application — never apply dry on leaves. Use a clean mixing container and follow the recommended dosage on the pack.',
    tags: (n) => ['powder-fertilizer', 'micronutrient', 'water-soluble', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'crop-care/Field Seeds': {
    category: 'Seeds & Saplings', subcategory: 'Field Crops',
    brands: ['Farmers Factory', 'IGO Seeds', 'Corteva'],
    price: [180, 620], unit: (rnd) => `${pick(rnd, [1, 2, 5])} kg pack`,
    isOrganic: false, problemFilter: 'Growth Boosters',
    desc: (n) => `${n} offers high-purity, certified field-crop seed with strong germination rates and regional climate suitability — bred for reliable yield across Tamil Nadu's growing conditions.`,
    composition: (n) => `${n} seed — certified seed lot, germination > 85%, genetic purity > 98%.`,
    usage: () => 'Treat seeds with recommended fungicide before sowing; sow at recommended row spacing and depth for your soil type and irrigation method.',
    tags: (n) => ['seeds', 'field-crop', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'crop-care/Fruit Seed': {
    category: 'Seeds & Saplings', subcategory: 'Fruits',
    brands: ['Syngenta', 'IGO Seeds', 'Farmers Factory'],
    price: [150, 540], unit: (rnd) => `Pack of ${pick(rnd, [10, 20, 50])} g`,
    isOrganic: false, problemFilter: 'Growth Boosters',
    desc: (n) => `${n} seeds are selected from high-yielding parent stock for uniform fruit set, good shelf life and disease tolerance — well suited to home gardens, polyhouses and open-field cultivation alike.`,
    composition: (n) => `${n} — hybrid/OP fruit seed, germination tested batch, purity verified.`,
    usage: () => 'Start in seedling trays with well-drained potting mix; transplant once 3-4 true leaves appear. Maintain consistent moisture during germination.',
    tags: (n) => ['seeds', 'fruit-seeds', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'crop-care/Flowers': {
    category: 'Seeds & Saplings', subcategory: 'Flowers',
    brands: ['IGO Seeds', 'Farmers Factory', 'Multiplex'],
    price: [90, 320], unit: (rnd) => `Pack of ${pick(rnd, [5, 10, 25])} g`,
    isOrganic: false, problemFilter: 'Growth Boosters',
    desc: (n) => `${n} flower seeds produce vibrant, long-blooming displays — a favourite for borders, pots, cut-flower beds and pollinator-friendly gardens across IGO partner nurseries.`,
    composition: (n) => `${n} — open-pollinated flower seed, high viability, cleaned and graded.`,
    usage: () => 'Sow directly into prepared beds or trays at a shallow depth; thin seedlings once established and water gently to avoid disturbing roots.',
    tags: (n) => ['seeds', 'flowers', 'garden', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'crop-care/Vegetables': {
    category: 'Seeds & Saplings', subcategory: 'Vegetables',
    brands: ['Syngenta', 'Farmers Factory', 'IGO Seeds', 'UPL'],
    price: [120, 480], unit: (rnd) => `Pack of ${pick(rnd, [10, 20, 50])} g`,
    isOrganic: false, problemFilter: 'Growth Boosters',
    desc: (n) => `${n} seeds deliver vigorous, high-yielding plants with strong disease tolerance — selected and tested by IGO's seed quality team for South Indian growing conditions.`,
    composition: (n) => `${n} — hybrid vegetable seed, germination > 85%, treated for early protection.`,
    usage: () => 'Raise seedlings in pro-trays with vermicompost-enriched media; transplant after 3-4 weeks and maintain regular irrigation through the vegetative stage.',
    tags: (n) => ['seeds', 'vegetables', ...n.toLowerCase().split(' ').slice(0, 2)],
  },

  'farmer-factory-fruits': {
    category: 'Fresh Farm Produce', subcategory: 'Fruits',
    brands: ['Farmers Factory'],
    price: [60, 320], unit: (rnd) => pick(rnd, ['1 kg pack', '500 g pack', 'Pack of 6', 'Dozen pack']),
    isOrganic: false, problemFilter: 'Growth Boosters', isFresh: true,
    desc: (n) => `Farm-fresh ${n.toLowerCase()} sourced directly from Farmers Factory partner orchards and graded for ripeness, size and sweetness — picked, packed and dispatched the same day to keep it at peak freshness when it reaches your door.`,
    composition: (n) => `Fresh produce — ${n}, Grade A, hand-sorted.`,
    usage: () => 'Store at room temperature until ripe, then refrigerate; consume within 4-7 days of delivery for the best flavour and texture.',
    tags: (n) => ['fresh-produce', 'fruits', 'farm-to-door', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'farmer-factory-vegetables': {
    category: 'Fresh Farm Produce', subcategory: 'Vegetables',
    brands: ['Farmers Factory'],
    price: [25, 180], unit: (rnd) => pick(rnd, ['1 kg pack', '500 g pack', 'Bunch of 3', 'Pack of 250 g']),
    isOrganic: false, problemFilter: 'Growth Boosters', isFresh: true,
    desc: (n) => `Farm-fresh ${n.toLowerCase()} harvested within 24 hours from Farmers Factory partner farms near Chennai — washed, graded and packed for same-day dispatch with full traceability back to the growing plot.`,
    composition: (n) => `Fresh produce — ${n}, Grade A, harvested to order.`,
    usage: () => 'Refrigerate on arrival; wash thoroughly before cooking and use within 4-6 days for best freshness.',
    tags: (n) => ['fresh-produce', 'vegetables', 'farm-to-door', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'farmer-factory-valluvam': {
    category: 'Native Foods & Millets', subcategory: 'Valluvam Native Foods',
    brands: ['Farmers Factory', 'IGO Bio Solutions'],
    price: [120, 1450], unit: (rnd) => pick(rnd, ['250 g pack', '500 g pack', '1 kg pack', '1 L bottle', '200 ml jar']),
    isOrganic: true, problemFilter: 'Growth Boosters', isFresh: false,
    desc: (n) => `${n} from the Valluvam native-foods range is sourced from traditional farming communities and processed using time-honoured methods with no chemical additives — a wholesome, chemical-free addition to the everyday Indian kitchen.`,
    composition: (n) => `${n} — natural, minimally processed, no added preservatives or artificial colours.`,
    usage: () => 'Store in a cool, dry, airtight container away from direct sunlight; check the pack label for cooking ratios and soaking instructions where applicable.',
    tags: (n) => ['valluvam', 'native-foods', 'millets', 'organic', ...n.toLowerCase().split(' ').slice(0, 2)],
  },

  'nursery-indoor': {
    category: 'Indoor Plants', subcategory: 'Indoor Plants',
    brands: ['IGO Greenhouse', 'Farmers Factory'],
    price: [149, 1290], unit: () => '1 potted plant (4-6 inch nursery pot)',
    isOrganic: false, problemFilter: 'Growth Boosters', isPlant: true,
    desc: (n) => `The ${n} is a popular low-maintenance houseplant prized for its air-purifying qualities and elegant foliage — grown in IGO Greenhouse polyhouses and shipped in a sturdy nursery pot ready to display indoors.`,
    composition: () => 'Live potted plant in a breathable nursery grow-bag/pot with well-draining potting mix.',
    usage: () => 'Place in bright, indirect light; water when the top inch of soil feels dry and avoid waterlogging. Wipe leaves occasionally to keep them dust-free and photosynthesising well.',
    tags: (n) => ['indoor-plant', 'houseplant', 'air-purifying', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'nursery-outdoor': {
    category: 'Outdoor Plants & Trees', subcategory: 'Outdoor Plants & Trees',
    brands: ['IGO Greenhouse', 'Farmers Factory', 'IGO Agri Estates'],
    price: [129, 2450], unit: () => '1 sapling (1-2 ft, polybag)',
    isOrganic: false, problemFilter: 'Growth Boosters', isPlant: true,
    desc: (n) => `The ${n} is a hardy outdoor variety well-suited to Tamil Nadu's climate — ideal for gardens, avenue planting, farm borders or landscaping projects, and supplied as a healthy, field-ready sapling.`,
    composition: () => 'Live sapling/plant supplied in a polybag or nursery pot with established root ball.',
    usage: () => 'Plant in a sunny to partially-shaded spot with well-drained soil; water deeply at planting and regularly during the establishment phase (first 6-8 weeks).',
    tags: (n) => ['outdoor-plant', 'tree', 'landscaping', 'garden', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
  'nursery-essentials': {
    category: 'Nursery & Garden Essentials', subcategory: 'Tools & Accessories',
    brands: ['IGO Greenhouse', 'Farmers Factory', 'Katyayani', 'STIHL'],
    price: [89, 2200], unit: (rnd) => pick(rnd, ['1 piece', 'Pack of 2', 'Pack of 5', 'Pack of 12', 'Pack of 96']),
    isOrganic: false, problemFilter: 'Soil Health', isTool: true,
    desc: (n) => `${n} is a practical nursery and home-gardening essential used daily across IGO Greenhouse production units — built for repeated use and designed to make planting, propagation and plant care simpler for growers of every scale.`,
    composition: () => 'Durable gardening accessory/tool — refer to the product image for exact material, size and pack contents.',
    usage: () => 'Use as intended for nursery, balcony or farm gardening tasks; clean and store in a dry place after use to extend its working life.',
    tags: (n) => ['nursery', 'garden-tools', 'gardening', ...n.toLowerCase().split(' ').slice(0, 2)],
  },
};

// crop guesses for fresh produce / seeds (keeps the existing "Shop by Crop" filter useful)
function cropGuess(name) {
  const n = name.toLowerCase();
  const known = ['tomato', 'banana', 'guava', 'mango', 'melon', 'pomegranate', 'sapota', 'strawberry',
    'lime', 'watermelon', 'amla', 'apple', 'kiwi', 'orange', 'papaya', 'pineapple', 'grapes',
    'gourd', 'corn', 'potato', 'chilli', 'chili', 'beans', 'brinjal', 'broccoli', 'mushroom', 'cabbage',
    'capsicum', 'cauliflower', 'cucumber', 'garlic', 'ginger', 'peas', 'okra', 'mint', 'coriander',
    'onion', 'pumpkin', 'radish', 'carrot', 'beetroot', 'lemon', 'drumstick', 'wheat', 'paddy',
    'maize', 'groundnut', 'sunflower', 'jasmine', 'marigold', 'rose', 'cardamom', 'cinnamon', 'pepper'];
  for (const k of known) if (n.includes(k)) return k.charAt(0).toUpperCase() + k.slice(1);
  return null;
}

// ---------- discover files ----------
const PRODUCTS = [];
const usedSlugs = new Set();

function uniqueSlug(base) {
  let s = base, i = 2;
  while (usedSlugs.has(s)) { s = `${base}-${i}`; i++; }
  usedSlugs.add(s);
  return s;
}

function processDir(relCatalogDir, blueprintKey) {
  const bp = BLUEPRINTS[blueprintKey];
  if (!bp) throw new Error('No blueprint for ' + blueprintKey);
  const absDir = path.join(CATALOG_DIR, relCatalogDir);
  if (!fs.existsSync(absDir)) { console.warn('Missing dir', absDir); return; }
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.isDirectory()) {
      processDir(path.join(relCatalogDir, ent.name), blueprintKey);
      continue;
    }
    if (!/\.(png|webp|jpg|jpeg|jfif|avif)$/i.test(ent.name)) continue;
    let rawName = titleCase(ent.name);
    rawName = cleanProductName(rawName);
    if (!rawName) continue;
    const idSeed = `${relCatalogDir}/${ent.name}`;
    const rnd = seeded(idSeed);
    const brand = pick(rnd, bp.brands);
    const isIgoOwn = brand.startsWith('IGO') || brand === 'Farmers Factory';
    const [lo, hi] = bp.price;
    const price = round5(intIn(rnd, lo, hi));
    const mrp = round5(Math.round(price * (1 + intIn(rnd, 12, 32) / 100)));
    const discount = Math.round(((mrp - price) / mrp) * 100);
    const stock = intIn(rnd, bp.isFresh ? 25 : 15, bp.isFresh ? 220 : 180);
    const rating = (4.1 + rnd() * 0.8).toFixed(1);
    const reviewCount = intIn(rnd, 8, 96);
    const slugBase = slugify(`${brand}-${rawName}`);
    const slug = uniqueSlug(slugBase);
    const id = `prod-real-${PRODUCTS.length + 1}`.padStart(14, '0').replace(/^0+(?=prod)/, '');
    // Properly URI-encode each path segment (handles spaces, %, &, #, ', parentheses, etc.)
    // — encoding only file/folder name segments, not the leading slashes.
    const rawSegments = `catalog/${relCatalogDir.replace(/\\/g, '/')}/${ent.name}`.split('/');
    const imgPath = '/' + rawSegments.map(seg => encodeURIComponent(seg)).join('/');
    const crop = cropGuess(rawName);

    const entry = {
      id: `prod-real-${PRODUCTS.length + 1}`,
      name: `${brand} ${rawName}`.trim(),
      displayName: rawName,
      slug,
      brand,
      category: bp.category,
      subcategory: bp.subcategory,
      price, mrp, discount, stock,
      images: [imgPath],
      description: bp.desc(rawName),
      composition: bp.composition(rawName),
      usage: bp.usage(rawName),
      rating: Number(rating),
      reviewCount,
      isIgoOwn,
      problemFilter: bp.problemFilter,
      tags: Array.from(new Set(bp.tags(rawName).map(t => t.toLowerCase().replace(/[^a-z0-9-]/g, '')))).filter(Boolean).slice(0, 6),
      unit: bp.unit(rnd),
      isOrganic: !!bp.isOrganic,
      crops: crop ? [crop] : ['All crops'],
    };
    PRODUCTS.push(entry);
  }
}

// folder -> blueprint mapping
processDir('crop-care/Chemical Fertilizers', 'crop-care/Chemical Fertilizers');
processDir('crop-care/Organic Fertilizers', 'crop-care/Organic Fertilizers');
processDir('crop-care/liquid', 'crop-care/liquid');
processDir('crop-care/powder', 'crop-care/powder');
processDir('crop-care/Field Seeds', 'crop-care/Field Seeds');
processDir('crop-care/Fruit Seed', 'crop-care/Fruit Seed');
processDir('crop-care/Flowers', 'crop-care/Flowers');
processDir('crop-care/Vegetables', 'crop-care/Vegetables');
processDir('farmer-factory-fruits', 'farmer-factory-fruits');
processDir('farmer-factory-vegetables', 'farmer-factory-vegetables');
processDir('farmer-factory-valluvam', 'farmer-factory-valluvam');
processDir('nursery-indoor', 'nursery-indoor');
processDir('nursery-outdoor', 'nursery-outdoor');
processDir('nursery-essentials', 'nursery-essentials');

console.log(`Generated ${PRODUCTS.length} products`);

// ---------- category roll-up ----------
const CATEGORY_ICONS = {
  'Seeds & Saplings': 'Sprout',
  'Fertilizers': 'Leaf',
  'Crop Care': 'ShieldAlert',
  'Bioproducts': 'Activity',
  'Farm Implements': 'Hammer',
  'Farm Automation': 'Cpu',
  'Protein Cuts': 'Beef',
  'Garden Care': 'Flower2',
  'Fresh Farm Produce': 'Carrot',
  'Irrigation & Water Management': 'Droplets',
  'Native Foods & Millets': 'Wheat',
  'Indoor Plants': 'Home',
  'Outdoor Plants & Trees': 'TreePine',
  'Nursery & Garden Essentials': 'Shovel',
};
const counts = {};
for (const p of PRODUCTS) counts[p.category] = (counts[p.category] || 0) + 1;
const categories = Object.keys(counts).map(name => ({
  id: slugify(name), name, slug: slugify(name),
  icon: CATEGORY_ICONS[name] || 'Sprout',
  productCount: counts[name],
}));

// ---------- emit TS file ----------
function tsStr(v) { return `'${esc(v)}'`; }
function tsArr(arr) { return `[${arr.map(tsStr).join(', ')}]`; }

let out = `// AUTO-GENERATED by generate-catalog.cjs — DO NOT HAND EDIT.
// Real product catalog sourced from images in /public/catalog (copied from sibling
// Igo- Crop Care, Igo-Farmer Factory and Igo-Nursery project asset folders).
import { Product, Category } from './types';

export const REAL_CATEGORIES: Category[] = [
${categories.map(c => `  { id: ${tsStr(c.id)}, name: ${tsStr(c.name)}, slug: ${tsStr(c.slug)}, icon: ${tsStr(c.icon)}, productCount: ${c.productCount} }`).join(',\n')}
];

export const REAL_PRODUCTS: Product[] = [
${PRODUCTS.map(p => `  {
    id: ${tsStr(p.id)},
    name: ${tsStr(p.name)},
    displayName: ${tsStr(p.displayName)},
    slug: ${tsStr(p.slug)},
    brand: ${tsStr(p.brand)},
    category: ${tsStr(p.category)},
    subcategory: ${tsStr(p.subcategory)},
    price: ${p.price},
    mrp: ${p.mrp},
    discount: ${p.discount},
    stock: ${p.stock},
    images: ${tsArr(p.images)},
    description: ${tsStr(p.description)},
    composition: ${tsStr(p.composition)},
    usage: ${tsStr(p.usage)},
    rating: ${p.rating},
    reviewCount: ${p.reviewCount},
    isIgoOwn: ${p.isIgoOwn},
    problemFilter: ${tsStr(p.problemFilter)},
    tags: ${tsArr(p.tags)},
    unit: ${tsStr(p.unit)},
    isOrganic: ${p.isOrganic},
    crops: ${tsArr(p.crops)}
  }`).join(',\n')}
];
`;

fs.writeFileSync(OUT_FILE, out, 'utf-8');
console.log('Wrote', OUT_FILE, `(${PRODUCTS.length} products, ${categories.length} categories)`);
