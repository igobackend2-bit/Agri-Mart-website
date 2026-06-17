import { Product, Category, Brand, Service, Course, BlogPost } from './types';

export const SEED_BRANDS: Brand[] = [
  // IGO Own Brands
  { id: 'igo-pf', name: 'IGO Precision Farming', type: 'igo_own' },
  { id: 'igo-fa', name: 'IGO Farm Automation', type: 'igo_own' },
  { id: 'igo-pc', name: 'IGO Protein Cuts', type: 'igo_own' },
  { id: 'igo-ae', name: 'IGO Agri Estates', type: 'igo_own' },
  { id: 'igo-fl', name: 'IGO Farm Loans', type: 'igo_own' },
  { id: 'igo-ac', name: 'IGO Academy', type: 'igo_own' },
  { id: 'igo-ex', name: 'IGO Exports & Imports', type: 'igo_own' },
  { id: 'igo-bs', name: 'IGO Bio Solutions', type: 'igo_own' },
  { id: 'igo-gh', name: 'IGO Greenhouse', type: 'igo_own' },
  { id: 'igo-sd', name: 'IGO Seeds', type: 'igo_own' },
  { id: 'igo-ft', name: 'IGO Fertigation', type: 'igo_own' },
  { id: 'igo-ds', name: 'IGO Drone Services', type: 'igo_own' },
  { id: 'igo-ff', name: 'Farmers Factory', type: 'igo_own' },
  // Third Party Brands
  { id: 'syngenta', name: 'Syngenta', type: 'third_party' },
  { id: 'upl', name: 'UPL', type: 'third_party' },
  { id: 'dhanuka', name: 'Dhanuka', type: 'third_party' },
  { id: 'stihl', name: 'STIHL', type: 'third_party' },
  { id: 'tata-rallis', name: 'Tata Rallis', type: 'third_party' },
  { id: 'coromandel', name: 'Coromandel', type: 'third_party' },
  { id: 'fmc', name: 'FMC', type: 'third_party' },
  { id: 'corteva', name: 'Corteva', type: 'third_party' },
  { id: 'bayer', name: 'Bayer', type: 'third_party' },
  { id: 'basf', name: 'BASF', type: 'third_party' },
  { id: 'pi-industries', name: 'PI Industries', type: 'third_party' },
  { id: 'tapas', name: 'TAPAS', type: 'third_party' },
  { id: 'radhe', name: 'Radhe', type: 'third_party' },
  { id: 'green-garden', name: 'Green Garden', type: 'third_party' },
  { id: 'anil-packaging', name: 'ANIL PACKAGING', type: 'third_party' },
  { id: 't-stanes', name: 'T-Stanes', type: 'third_party' },
  { id: 'multiplex', name: 'Multiplex', type: 'third_party' },
  { id: 'katyayani', name: 'Katyayani', type: 'third_party' }
];

// FULL CATALOG — built ONLY from the real product image folders
// (farmer-factory-vegetables/-fruits/-valluvam, crop-care/*, nursery-indoor/outdoor).
// One product per image, correct name, real category. No demo/placeholder data.
import { CATALOG_PRODUCTS } from './catalogProducts';

export const SEED_PRODUCTS: Product[] = CATALOG_PRODUCTS;

const CATEGORY_ICONS: Record<string, string> = {
  'Vegetables': 'Carrot',
  'Fruits': 'Apple',
  'Valluvam Products': 'Wheat',
  'Vegetable Seeds': 'Sprout',
  'Fruit Seeds': 'Sprout',
  'Field Seeds': 'Wheat',
  'Flower Seeds': 'Flower2',
  'Liquid Fertilizers': 'Droplets',
  'Powder Fertilizers': 'Package',
  'Chemical Fertilizers': 'FlaskConical',
  'Organic Fertilizers': 'Leaf',
  'Indoor Plants': 'Home',
  'Outdoor Plants & Trees': 'TreePine',
  'Precision Tools & Equipments': 'Wrench',
  'Nursery Tools': 'Sprout',
};

// Display order for the storefront
const CATEGORY_ORDER = [
  'Vegetables', 'Fruits', 'Valluvam Products',
  'Vegetable Seeds', 'Fruit Seeds', 'Field Seeds', 'Flower Seeds',
  'Liquid Fertilizers', 'Powder Fertilizers', 'Chemical Fertilizers', 'Organic Fertilizers',
  'Indoor Plants', 'Outdoor Plants & Trees', 'Precision Tools & Equipments',
  'Nursery Tools',
];

export const SEED_CATEGORIES: Category[] = CATEGORY_ORDER
  .filter((name) => CATALOG_PRODUCTS.some((p) => p.category === name))
  .map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    icon: CATEGORY_ICONS[name] || 'Leaf',
    productCount: CATALOG_PRODUCTS.filter((p) => p.category === name).length,
  }));


export const CROP_KITS = [
  {
    id: 'kit-01',
    name: 'IGO Supreme Crop Solution Kit (Fruit & Veg Boost)',
    price: 899,
    mrp: 1350,
    discount: 33,
    description: 'Comprehensive combo specifically designed for high-yielding tomato, chilli, and cucumber gardeners. Includes Premium Hybrid Seeds, NPK Soluble Feed + Bio Organic Seaweed Extract!',
    items: ['prod-seeds-01', 'prod-fert-01', 'prod-bio-01']
  },
  {
    id: 'kit-02',
    name: 'IGO Shield Organic Protection Kit (Disease + Pest Control)',
    price: 999,
    mrp: 1500,
    discount: 33,
    description: 'Zero chemical organic safeguard kit for balcony containers and farms. Includes Katyayani Premium Neem Oil + T-Stanes Trichoderma Biofungicide + Multiplex Bio Fungal Defense Spray!',
    items: ['prod-care-04', 'prod-bio-02', 'prod-gard-04']
  }
];

export const SUBSIDY_INFO = [
  {
    schemeName: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    subsidyAmount: 'Up to 55% for small & marginal farmers',
    applicableFor: 'Drip Systems, Sprinkler Systems, Greenhouse structures',
    authorizedProvider: 'IGO Farm Automation',
    processLink: '#'
  },
  {
    schemeName: 'Tamil Nadu Agribusiness Subvention & Machineries Scheme',
    subsidyAmount: '40% to 50% capital subsidy with interest subvention',
    applicableFor: 'Brush Cutters, Sprayers, Earth Augers, Power Weeders',
    authorizedProvider: 'Farmers Factory / STIHL partnered',
    processLink: '#'
  },
  {
    schemeName: 'Govt Organic Farming Promotion Subsidy (Paramparagat Krishi Vikas Yojana)',
    subsidyAmount: '₹31,000 incentive voucher per hectare',
    applicableFor: 'IGO Bio Solutions, Vermicompost, Organic Manures',
    authorizedProvider: 'IGO Bio Solutions',
    processLink: '#'
  }
];

export const SEED_SERVICES: Service[] = [
  {
    id: 'srv-01',
    name: 'Soil Analysis & Laboratory Testing',
    slug: 'soil-analysis-test',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
    description: 'Affordable on-site sample collection followed by deep chemical analysis in our Chennai high-tech laboratory. Evaluates NPK, pH levels, carbon indices, and trace minerals.',
    category: 'Expert Services',
    provider: 'IGO Bio Solutions Lab',
    priceQuote: '₹450 / Sample',
    features: [
      '12-parameter nutrition mapping',
      'pH and EC correction advice',
      'Digital report within 48 hours to WhatsApp',
      'Tailored fertilizer and lime suggestions'
    ]
  },
  {
    id: 'srv-02',
    name: 'Custom Drip Irrigation Designing',
    slug: 'drip-irrigation-design',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
    description: 'Let our expert fertigation architects design a high-efficiency drip or mist network for your crop fields. Customized layout blueprints optimizing water pressure.',
    category: 'Farm Automation',
    provider: 'IGO Farm Automation',
    priceQuote: 'Free Quote & Blueprint',
    features: [
      'Tailor-made pipe sizing',
      'Nozzle blockage preventative selection',
      'Automation solenoid layout recommendations',
      'Subsidy support document preparation'
    ]
  },
  {
    id: 'srv-03',
    name: 'Smart Drone Spraying Service',
    slug: 'drone-spray-service',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80',
    description: 'Fast, automated application of bio-insecticides, organic nutrients, and weed defenses using certified hexacopter drones. Minimizes chemical exposure.',
    category: 'Expert Services',
    provider: 'IGO Drone Services',
    priceQuote: 'From ₹650 / Acre',
    features: [
      '95% water volume reduction',
      'Full field completed in 15 minutes',
      'Zero manual chemical contact',
      'GPS mapped flight plan guarantees 100% covers'
    ]
  },
  {
    id: 'srv-04',
    name: 'Agrarian Property Survey & Estates',
    slug: 'property-survey-estates',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    description: 'Comprehensive topography mapping, boundary valuation, and agricultural resource evaluation for buyers, lessors, and estates.',
    category: 'Expert Services',
    provider: 'IGO Agri Estates',
    priceQuote: 'On-Site Estimation',
    features: [
      'Sub-meter accuracy GPS boundaries',
      'Farming water-yield assessment',
      'Soil topography elevation contours',
      'Lease valuation consulting'
    ]
  },
  {
    id: 'srv-05',
    name: 'Carbon Credit Registration',
    slug: 'carbon-credit-reg',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Transform your organic sustainable farming practices into yearly recurring cash inflows. We verify your actions and lock carbon points.',
    category: 'Bioproducts',
    provider: 'IGO Bio Solutions',
    priceQuote: 'Consultancy Commission Model',
    features: [
      'Soil carbon content certification',
      'Global offset marketplace listing',
      'Regular yearly incentive payouts',
      'Free organic farming transition blueprints'
    ]
  },
  {
    id: 'srv-06',
    name: 'Polyhouse Structural Erection',
    slug: 'polyhouse-erection',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    description: 'Get an end-to-end greenhouse or polyhouse designed to withstand high winds and Chennai humidity. Automated ventilation systems to prevent fungal spores.',
    category: 'Expert Services',
    provider: 'IGO Greenhouse',
    priceQuote: 'Govt Subsidy Assistance (PMKSY)',
    features: [
      'G.I. pipe framework structural setup',
      '200-micron UV stabilizer cooling film covers',
      'Automated misting and shade nets',
      'Full setup with govt subsidy aid'
    ]
  },
  {
    id: 'srv-07',
    name: 'Precision Fertigation Auditing',
    slug: 'fertigation-audit',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
    description: 'Our expert agronomists evaluate your current drip lines and liquid fertilizer formulas on-site. Eliminate nutrient washing and mineral crusts.',
    category: 'Expert Services',
    provider: 'IGO Fertigation',
    priceQuote: '₹1,200 / Inspection',
    features: [
      'Nozzle blockage and pressure diagnosis',
      'Water electrical conductivity (EC) tracking',
      'Optimized NPK injection calendar',
      'Secondary nutrients dosage balance'
    ]
  },
  {
    id: 'srv-08',
    name: 'High-Density Orchard Setup',
    slug: 'orchard-setup',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
    description: 'Erect modern high-density mango, guava or citrus orchard plots. Reduces harvest cycle lengths using hybrid clones and optimized spacing models.',
    category: 'Expert Services',
    provider: 'Farmers Factory',
    priceQuote: 'Custom layouts layout',
    features: [
      'Optimum spacing layouts (e.g., 3m x 3m)',
      'Grafted high-yield hybrid saplings',
      '1st-year growth and replacements guarantee',
      'Automated drip plan incorporation'
    ]
  },
  {
    id: 'srv-09',
    name: 'Dairy Farm Automation Consulting',
    slug: 'dairy-automation',
    image: 'https://images.unsplash.com/photo-1527156080170-69f3d6872545?auto=format&fit=crop&w=600&q=80',
    description: 'Modernize traditional dairy cattle houses with automated milking machine units, pasture tags, and silage cutters.',
    category: 'Farm Automation',
    provider: 'IGO Farm Automation',
    priceQuote: 'Interactive plans',
    features: [
      'Milking machine layout spacing',
      'Cattle health and rumination sensor tags',
      'SILO fodder chopper setups',
      'Hygienic waste gasifier designs'
    ]
  },
  {
    id: 'srv-10',
    name: 'Cold Storage Logistical Liaison',
    slug: 'cold-storage-logistics',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    description: 'Ship high-value perishables, seafood or exotic fruits from Chennai to global international gateways with complete temperature traceability.',
    category: 'Expert Services',
    provider: 'IGO Exports & Imports',
    priceQuote: 'Per Kg Logistics quotation',
    features: [
      'Continuous battery-tracked reefer vehicles',
      'Port custom clearances paperwork',
      'Phytosanitary certification support',
      'Direct Chennai Port cold room bookings'
    ]
  },
  {
    id: 'srv-11',
    name: 'Agrarian Legal Consulting',
    slug: 'agri-legal-consulting',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    description: 'Ensure smooth land records conversion, farm leases, or legal titles validation in Chennai and Tamil Nadu districts.',
    category: 'Expert Services',
    provider: 'IGO Group of Companies',
    priceQuote: '₹1,500 Consultation',
    features: [
      'Pattah, Chitta, Adangal validation',
      'Custom agricultural lease templates',
      'Land revenue tax registrations helpline',
      'Government land classification reviews'
    ]
  }
];

export const SEED_COURSES: Course[] = [
  {
    id: 'cls-01',
    title: 'Precision Hydroponic Masterclass',
    slug: 'precision-hydroponics',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    instructor: 'Dr. S. Anbarasan',
    lessonsCount: 18,
    duration: '6 Hours',
    level: 'Intermediate',
    originalPrice: 2999,
    currentPrice: 1499,
    description: 'Step-by-step masterclass on soil-less tomato & lettuce cultivation. Includes water quality, nutrient chemistry formulas, EC/pH parameters, and design of home or commercial deep-water channels as well as NFT setups.',
    modules: [
      'Introduction to Soil-less Cultivation',
      'Water parameters & Filtration requirements',
      'NPK Liquid Chemistry Formulation guides',
      'TDS, EC, and pH balancing schedules',
      'NFT vs Deep Water Culture physical setups',
      'Pest protection inside hydroponic greenhouses'
    ]
  },
  {
    id: 'cls-02',
    title: 'Organic Farming & Biofertilizers',
    slug: 'organic-farming-biofertilizers',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    instructor: 'Murugan G. (Organic Pioneer)',
    lessonsCount: 12,
    duration: '4 Hours',
    level: 'Beginner',
    originalPrice: 1249,
    currentPrice: 499,
    description: 'A complete practical curriculum covering organic agriculture. Discover secrets of Panchagavya, Jeevamirtham, Trichoderma Viride inoculum, vermirouting, and hot compost mixtures.',
    modules: [
      'Understanding Soil Ecosystems',
      'Panchagavya & Jeevamirtham formulation',
      'Fungal antagonists: Trichoderma viride application',
      'Designing compost stations and worm bins',
      'Organic companion planting secrets',
      'Eco-friendly pest defense with neem fractions'
    ]
  },
  {
    id: 'cls-03',
    title: 'DGCA Certified Agri Drone Pilot Training',
    slug: 'agri-drone-pilot',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80',
    instructor: 'Capt. Hari Prasath',
    lessonsCount: 24,
    duration: '12 Hours',
    level: 'Professional',
    originalPrice: 9999,
    currentPrice: 4999,
    description: 'Learn dynamic drone controls for agrochemical deployment, infrared crop disease inspection, and precise volumetric crop count calculations.',
    modules: [
      'Basic Aerodynamics & Multi-rotor physics',
      'DGCA Rules and airspace permissions',
      'Autonomous flight planning & GPS routes',
      'Nozzle calibration & aerosol control',
      'Infrared Multispectral Crop Disease analysis',
      'Emergency recovery commands in high winds'
    ]
  }
];

export const SEED_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    title: 'Maximizing Paddy Yields in Cauvery Delta',
    slug: 'maximize-paddy-cauvery',
    excerpt: 'Actionable techniques to double rice produce using bio-boosters, wet-dry water cycles, and organic nitrogen formulas.',
    content: 'Paddy farming in the Cauvery Delta region faces multiple constraints - from erratic water supplies to escalating fertilizer costs. Fortunately, the System of Rice Intensification (SRI) provides an efficient path. By transplanting young seedlings early (8-12 days) rather than later, spacing them widely, and maintaining moist soils instead of continuous flooding, farmers can double their harvest while reducing water needs by 40%. Additionally, integrating Azospirillum and Phosphobacteria bio-inputs helps fix atmospheric nitrogen natively, saving up to 25% on chemical urea. Explore IGO Bio Solutions for tailored microbial cultures designed for Tamil Nadu soil conditions.',
    category: 'Crop Advice',
    author: 'Dr. Radha Krishnan (Agronomy Consultant)',
    readTime: '5 min read',
    image: '/images/post_paddy_india.png',
    createdAt: '2026-05-18T10:00:00Z',
    tags: ['Paddy', 'Biofertilizers', 'Cauvery Delta', 'SRI']
  },
  {
    id: 'post-02',
    title: 'The Ultimate Guide to Soil Enrichment using Vermicompost',
    slug: 'guide-vermicompost-soil',
    excerpt: 'Restore depleted organic matter, establish soil structure and nourish beneficial microbes using digested worm castings.',
    content: 'Years of heavy synthetic fertilizer applications have depleted organic soil carbon from an optimal 1.5% down to under 0.4% in many districts. Organic Vermicompost acts as the fastest rescue mechanism. Comprising red-worm digested plant matter, it is rich in humic acids, growth-promoting hormones, and a highly active microbiome. Adding vermicompost improves soil moisture holding capacity, makes phosphate minerals soluble, and buffers soils against root diseases. For garden potting soils, mix 30% Farmers Factory Vermicompost with cocopeat and red soil for exceptional results.',
    category: 'Soil Health',
    author: 'Rajesh Kumar (Organic Farmer)',
    readTime: '4 min read',
    image: '/images/post_vermicompost.png',
    createdAt: '2026-05-25T11:00:00Z',
    tags: ['Vermicompost', 'Soil Enrichment', 'Organic', 'Manures']
  },
  {
    id: 'post-03',
    title: 'Smart Drip Automation: Reducing Water Usage by 60%',
    slug: 'smart-drip-irrigation-saving',
    excerpt: 'How IoT sensors, automated mist solenoid valves, and gravity drip lines prevent water waste while multiplying fertilizer efficiency.',
    content: 'Traditional flood irrigation wastes up to 70% of applied water via evapo-transpiration and deep percolation. Moreover, it carries expensive dissolved fertilizers away from active root clusters. Drip irrigation coupled with low-cost automation resolves this problem. By placing emitters precisely beside each crop root and leveraging smart soil-moisture probes, the system triggers short, precise watering intervals only when soil drying occurs. This preserves root aeration and maintains optimal nutrient humidity, resulting in up to 40% higher crop yield. Contact IGO Farm Automation to receive a customized schematic design tailored for your horticultural estate.',
    category: 'Farm Tech',
    author: 'Anita Devendra (Agribusiness Engineer)',
    readTime: '6 min read',
    image: '/images/post_drip_automation.png',
    createdAt: '2026-06-01T09:00:00Z',
    tags: ['Drip Systems', 'IoT Sensors', 'Automation', 'Conservation']
  }
];
