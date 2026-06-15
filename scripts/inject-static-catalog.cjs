const fs = require('fs');
const path = require('path');

const attachmentPath = process.argv[2];
if (!attachmentPath) {
  throw new Error('Usage: node scripts/inject-static-catalog.cjs <pasted-text-path>');
}

const source = fs.readFileSync(attachmentPath, 'utf8').replace(/\r\n/g, '\n');

const categoryIcons = {
  SEEDS: 'fa-seedling',
  'PLANTS & SAPLINGS': 'fa-tree',
  FERTILIZERS: 'fa-flask',
  'CROP PROTECTION': 'fa-shield-halved',
  IRRIGATION: 'fa-droplet',
  'FARM MACHINERY': 'fa-tractor',
  'AGRICULTURAL TOOLS': 'fa-screwdriver-wrench',
  'GREENHOUSE & NURSERY': 'fa-leaf',
  HYDROPONICS: 'fa-water',
  'DAIRY FARMING': 'fa-cow',
  'POULTRY FARMING': 'fa-kiwi-bird',
  'GOAT & SHEEP FARMING': 'fa-paw',
  'FISHERIES & AQUACULTURE': 'fa-fish',
  BEEKEEPING: 'fa-hexagon-nodes',
  'MUSHROOM FARMING': 'fa-seedling',
  'FODDER & FEED': 'fa-wheat-awn',
  'VETERINARY PRODUCTS': 'fa-kit-medical',
  FENCING: 'fa-grip-lines-vertical',
  'POST HARVEST': 'fa-warehouse',
  'PACKAGING MATERIALS': 'fa-box-open',
  'SOLAR AGRICULTURE': 'fa-solar-panel',
  'PRECISION AGRICULTURE': 'fa-satellite-dish',
  FORESTRY: 'fa-tree',
  'RAW AGRICULTURAL PRODUCTS': 'fa-wheat-awn',
  FRUITS: 'fa-apple-whole',
  VEGETABLES: 'fa-carrot',
  PULSES: 'fa-bowl-food',
  'PROCESSED FARM PRODUCTS': 'fa-jar',
  'LAB & TESTING': 'fa-vial',
  'AGRICULTURAL SERVICES': 'fa-handshake',
};

function esc(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\b[a-z]/g, (match) => match.toUpperCase())
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bFor\b/g, 'for');
}

const knownHeadings = new Set(Object.keys(categoryIcons));
const groups = [];
let current = null;
for (const rawLine of source.split('\n')) {
  const line = rawLine.trim();
  if (!line) continue;
  if (knownHeadings.has(line)) {
    current = { heading: line, items: [] };
    groups.push(current);
  } else if (current) {
    current.items.push(titleCase(line));
  }
}

const totalProducts = groups.reduce((sum, group) => sum + group.items.length, 0);

const section = `<!-- FULL PRODUCT CATALOG START -->
<section class="section full-catalog-section" id="all-products">
  <div class="container">
    <div class="sec-hdr">
      <div>
        <div class="sec-title">Complete IGO AgriMart Product Catalogue</div>
        <div class="sec-sub">${totalProducts}+ newly added products across seeds, inputs, machinery, livestock, produce, testing and agri services</div>
      </div>
      <a class="view-all" href="#top"><i class="fas fa-arrow-up"></i> Back to top</a>
    </div>
    <div class="catalog-note">
      <i class="fas fa-circle-check"></i>
      <span>Full range added from the supplied product list. Prices, pack sizes and supplier availability can be finalized per live inventory.</span>
    </div>
    <div class="catalog-grid">
${groups.map((group) => `      <details class="catalog-group" open>
        <summary><span><i class="fas ${categoryIcons[group.heading] || 'fa-box'}"></i> ${esc(titleCase(group.heading))}</span><em>${group.items.length} products</em></summary>
        <div class="catalog-items">
${group.items.map((item) => `          <button class="catalog-item" onclick="catalogInquiry('${esc(item).replace(/'/g, '\\&#39;')}')">${esc(item)}</button>`).join('\n')}
        </div>
      </details>`).join('\n')}
    </div>
  </div>
</section>
<!-- FULL PRODUCT CATALOG END -->`;

const styles = `/* FULL PRODUCT CATALOG */
.full-catalog-section{background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.catalog-note{display:flex;align-items:flex-start;gap:10px;background:var(--glight);border:1px solid var(--gborder);color:var(--g2);padding:12px 14px;border-radius:10px;font-size:.84rem;font-weight:600;margin-bottom:18px}
.catalog-note i{color:var(--g);margin-top:2px}
.catalog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
.catalog-group{background:#fff;border:1.5px solid var(--border);border-radius:10px;overflow:hidden;box-shadow:var(--shadow)}
.catalog-group summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 15px;background:#f8fafc;font-weight:800;color:var(--text)}
.catalog-group summary::-webkit-details-marker{display:none}
.catalog-group summary span{display:flex;align-items:center;gap:9px;font-size:.9rem}
.catalog-group summary i{color:var(--g);width:18px;text-align:center}
.catalog-group summary em{font-style:normal;font-size:.72rem;color:var(--muted);font-weight:700;white-space:nowrap}
.catalog-items{display:flex;flex-wrap:wrap;gap:8px;padding:14px;background:#fff}
.catalog-item{border:1px solid var(--border);background:#fff;color:#334155;border-radius:999px;padding:8px 11px;font-family:'Inter',sans-serif;font-size:.76rem;font-weight:700;cursor:pointer;transition:all .16s;line-height:1.1}
.catalog-item:hover{border-color:var(--g);background:var(--glight);color:var(--g);transform:translateY(-1px)}
@media(max-width:640px){.catalog-grid{grid-template-columns:1fr}.catalog-group summary{align-items:flex-start}.catalog-items{gap:7px}.catalog-item{font-size:.74rem;padding:7px 10px}}`;

function injectFile(filename) {
  const filePath = path.join(process.cwd(), filename);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('FULL PRODUCT CATALOG */')) {
    html = html.replace('</style>', `${styles}\n</style>`);
  }

  if (html.includes('<!-- FULL PRODUCT CATALOG START -->')) {
    html = html.replace(/<!-- FULL PRODUCT CATALOG START -->[\s\S]*?<!-- FULL PRODUCT CATALOG END -->/, section);
  } else if (html.includes('<!-- EVENTS SECTION -->')) {
    html = html.replace('<!-- EVENTS SECTION -->', `${section}\n\n<!-- EVENTS SECTION -->`);
  } else if (html.includes('<!-- FOOTER -->')) {
    html = html.replace('<!-- FOOTER -->', `${section}\n\n<!-- FOOTER -->`);
  } else {
    html = html.replace('</body>', `${section}\n</body>`);
  }

  const helper = `function catalogInquiry(name){
  showToast(name+' is available in the IGO AgriMart catalogue. Contact us for live price and stock.');
}`;
  if (!html.includes('function catalogInquiry')) {
    html = html.replace('// Lang toggle', `${helper}\n// Lang toggle`);
  }

  html = html.replace(/<div class="stat-num">1,200\+<\/div><div class="stat-label">Products in Catalogue<\/div>/, '<div class="stat-num">1,600+</div><div class="stat-label">Products in Catalogue</div>');
  html = html.replace(/Browse 1,200\+ farm inputs/g, 'Browse 1,600+ farm inputs');
  fs.writeFileSync(filePath, html);
}

injectFile('index.html');
injectFile('agrimart-landing.html');
console.log(`Injected ${totalProducts} catalog products into index.html and agrimart-landing.html.`);
