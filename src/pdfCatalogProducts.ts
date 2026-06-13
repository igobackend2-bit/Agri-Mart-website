// Products sourced from IGO Nursery Procurement List & Wholesale Price List (Sep 2025)
import { Product, Category } from './types';

export const PDF_CATEGORIES: Category[] = [
  { id: 'pots-containers', name: 'Pots & Planters', slug: 'pots-containers', icon: 'Flower', productCount: 22 },
  { id: 'hydroponic-systems', name: 'Hydroponic Systems', slug: 'hydroponic-systems', icon: 'Droplets', productCount: 18 },
  { id: 'grow-media', name: 'Grow Media & Substrates', slug: 'grow-media', icon: 'Layers', productCount: 14 },
  { id: 'germination-media', name: 'Germination Media', slug: 'germination-media', icon: 'Seed', productCount: 14 },
  { id: 'plant-support', name: 'Plant Support Materials', slug: 'plant-support-materials', icon: 'Shield', productCount: 34 },
  { id: 'agriculture-trays', name: 'Agriculture Trays', slug: 'agriculture-trays', icon: 'Tray', productCount: 17 },
  { id: 'tanks-reservoirs', name: 'Tanks & Reservoirs', slug: 'tanks-reservoirs', icon: 'Water', productCount: 10 },
  { id: 'pumps-irrigation', name: 'Pumps & Irrigation', slug: 'pumps-irrigation', icon: 'Fan', productCount: 39 },
  { id: 'grow-lights', name: 'Grow Lights', slug: 'grow-lights', icon: 'Sun', productCount: 8 },
  { id: 'garden-decor', name: 'Garden Decor', slug: 'garden-decor', icon: 'Star', productCount: 10 },
  { id: 'turf-grass', name: 'Turf & Grass', slug: 'turf-grass', icon: 'Leaf', productCount: 8 },
];

function buildAdditionalProducts(specs: Array<[string, string, string, string, string, string, number, string]>): Product[] {
  return specs.map(([id, name, displayName, slug, category, subcategory, price, unit]) => {
    const mrp = Math.round(price * 1.23);
    const discount = Math.round(((mrp - price) / mrp) * 100);
    return {
      id,
      name,
      displayName,
      slug,
      brand: 'IGO Agri TechFarms',
      category,
      subcategory,
      price,
      mrp,
      discount,
      stock: 120,
      images: [(() => {
        const SUBCAT_IMAGES: Record<string, string> = {
          'Soil Block Maker': '/catalog/nursery-essentials/cocopeat.png',
          'Seedling Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Nursery Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Spawn Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Root Trainer': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Sowing Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Bamboo Stick': '/catalog/nursery-essentials/moss-stick.jpg',
          'Start Stick': '/catalog/nursery-essentials/moss-stick.jpg',
          'Twine': '/catalog/nursery-essentials/hand-weeder-tool.jpg',
          'Plant Tie': '/catalog/nursery-essentials/hand-weeder.jpg',
          'Support Ring': '/catalog/nursery-essentials/hand-fork.jpg',
          'Support Wire': '/catalog/nursery-essentials/hand-weeder-tool.jpg',
          'Support Clip': '/catalog/nursery-essentials/plant-cutter.jpg',
          'Net': '/catalog/nursery-essentials/Creeper%20net.png',
          'Stake Pack': '/catalog/nursery-essentials/moss-stick.jpg',
          'Cage Support': '/catalog/nursery-essentials/hand-fork.jpg',
          'Trellis Mesh': '/catalog/nursery-essentials/Creeper%20net.png',
          'Basket Support': '/catalog/nursery-essentials/nursery-pots.jpg',
          'Hanging Chain': '/catalog/nursery-essentials/nursery-pots.jpg',
          'Coir Rope': '/catalog/nursery-essentials/moss-stick.jpg',
          'Palm Rope': '/catalog/nursery-essentials/moss-stick.jpg',
          'Jute Twine': '/catalog/nursery-essentials/moss-stick.jpg',
          'Heat Shrink Tape': '/catalog/nursery-essentials/gardening-scissor.jpg',
          'Graft Tape': '/catalog/nursery-essentials/1pc%20Eco-Friendly%20Biodegradable%20Grafting%20Tape%20Graft%20Membrane%20Gardening%20Bind%20Belt%20Plant%20Grafting.jpg',
          'Plant Twine': '/catalog/nursery-essentials/hand-weeder-tool.jpg',
          'Line Holder': '/catalog/nursery-essentials/hand-weeder-tool.jpg',
          'Stake': '/catalog/nursery-essentials/moss-stick.jpg',
          'Support Brace': '/catalog/nursery-essentials/moss-stick.jpg',
          'Label Set': '/catalog/nursery-essentials/hand-weeder-tool.jpg',
          'Marker Board': '/catalog/nursery-essentials/hand-weeder-tool.jpg',
          'Support Clamp': '/catalog/nursery-essentials/plant-cutter.jpg',
          'Mesh Sleeve': '/catalog/nursery-essentials/Creeper%20net.png',
          'Shade Net Clip': '/catalog/nursery-essentials/shade-net.jpg',
          'Tomato Cage': '/catalog/nursery-essentials/hand-fork.jpg',
          'Seed Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Flat Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Deep Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Microgreen Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Channel Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Propagation Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'NFT Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Pallet Tray': '/catalog/nursery-essentials/seedling-tray.jpg',
          'Grow Bag': '/catalog/nursery-essentials/nursery-pots.jpg',
          'Hanging Bag': '/catalog/nursery-essentials/nursery-pots.jpg',
        };
        return SUBCAT_IMAGES[subcategory] || '/catalog/nursery-essentials/nursery-pots.jpg';
      })()],
      description: `${displayName} designed for reliable ${subcategory.toLowerCase()} in agricultural and nursery applications.`,
      composition: 'Durable polypropylene construction with UV stabilization, ideal for nursery, greenhouse and hydroponic use.',
      usage: 'Use in nursery, greenhouse or farm propagation units. Clean and dry before reuse.',
      rating: 4.5,
      reviewCount: 28,
      isIgoOwn: true,
      problemFilter: 'Plant Care',
      tags: [subcategory.replace(/ /g, '-').toLowerCase(), category.replace(/ & /g, '-').replace(/ /g, '-').toLowerCase(), 'nursery', 'agriculture'],
      unit,
      isOrganic: false,
      crops: ['All crops'],
    };
  });
}

const ADDITIONAL_PDF_PRODUCT_SPECS: Array<[string, string, string, string, string, string, number, string]> = [
  ['pdf-gm-001','Soil Block Maker – 40 mm','Soil Block Maker 40mm','germination-media-block-40mm','Germination Media','Soil Block Maker',60,'1 Piece'],
  ['pdf-gm-002','Soil Block Maker – 50 mm','Soil Block Maker 50mm','germination-media-block-50mm','Germination Media','Soil Block Maker',75,'1 Piece'],
  ['pdf-gm-003','Soil Block Maker – 60 mm','Soil Block Maker 60mm','germination-media-block-60mm','Germination Media','Soil Block Maker',95,'1 Piece'],
  ['pdf-gm-004','Soil Block Maker – 80 mm','Soil Block Maker 80mm','germination-media-block-80mm','Germination Media','Soil Block Maker',120,'1 Piece'],
  ['pdf-gm-005','Seedling Tray 72 Cells','Seedling Tray 72 Cells','seedling-tray-72-cells','Germination Media','Seedling Tray',85,'1 Piece'],
  ['pdf-gm-006','Seedling Tray 128 Cells','Seedling Tray 128 Cells','seedling-tray-128-cells','Germination Media','Seedling Tray',95,'1 Piece'],
  ['pdf-gm-007','Seedling Tray 200 Cells','Seedling Tray 200 Cells','seedling-tray-200-cells','Germination Media','Seedling Tray',140,'1 Piece'],
  ['pdf-gm-008','Nursery Tray 18 Cells','Nursery Tray 18 Cells','nursery-tray-18-cells','Germination Media','Nursery Tray',55,'1 Piece'],
  ['pdf-gm-009','Mushroom Spawn Tray','Mushroom Spawn Tray','mushroom-spawn-tray','Germination Media','Spawn Tray',80,'1 Piece'],
  ['pdf-gm-010','Root Trainer Tray','Root Trainer Tray','root-trainer-tray','Germination Media','Root Trainer',98,'1 Piece'],
  ['pdf-gm-011','Sowing Tray Without Holes','Sowing Tray Without Holes','sowing-tray-without-holes','Germination Media','Sowing Tray',52,'1 Piece'],
  ['pdf-gm-012','Sowing Tray With Holes','Sowing Tray With Holes','sowing-tray-with-holes','Germination Media','Sowing Tray',62,'1 Piece'],
  ['pdf-gm-013','Tray with Transparent Lid 102x53','Tray with Transparent Lid 102x53','tray-transparent-lid-102x53','Germination Media','Seedling Tray',125,'1 Piece'],
  ['pdf-gm-014','Tray with Transparent Lid 104x78','Tray with Transparent Lid 104x78','tray-transparent-lid-104x78','Germination Media','Seedling Tray',155,'1 Piece'],
  ['pdf-ps-001','Bamboo Sticks (Pack of 50)','Bamboo Sticks Pack','bamboo-sticks-pack-50','Plant Support Materials','Bamboo Stick',130,'Pack of 50'],
  ['pdf-ps-002','Start Stick 8 Inch (100 pcs)','Start Stick 8 Inch','start-stick-8inch-100pcs','Plant Support Materials','Start Stick',125,'Pack of 100'],
  ['pdf-ps-003','Start Stick 12 Inch (100 pcs)','Start Stick 12 Inch','start-stick-12inch-100pcs','Plant Support Materials','Start Stick',155,'Pack of 100'],
  ['pdf-ps-004','Start Stick 16 Inch (100 pcs)','Start Stick 16 Inch','start-stick-16inch-100pcs','Plant Support Materials','Start Stick',190,'Pack of 100'],
  ['pdf-ps-005','Lashing Twine 100m','Lashing Twine 100m','lashing-twine-100m','Plant Support Materials','Twine',99,'100 m Roll'],
  ['pdf-ps-006','Soft Plant Tie 60m','Soft Plant Tie 60m','soft-plant-tie-60m','Plant Support Materials','Plant Tie',115,'60 m Roll'],
  ['pdf-ps-007','Plant Support Ring 8 Inch','Plant Support Ring 8 Inch','plant-support-ring-8inch','Plant Support Materials','Support Ring',75,'1 Piece'],
  ['pdf-ps-008','Plastic Coated Plant Support Wire 1kg','Support Wire 1kg','plant-support-wire-1kg','Plant Support Materials','Support Wire',245,'1 kg Coil'],
  ['pdf-ps-009','Plant Support Clip 100 pcs','Plant Support Clip 100 pcs','plant-support-clip-100pcs','Plant Support Materials','Support Clip',180,'Pack of 100'],
  ['pdf-ps-010','Grower Net 5x5 ft','Grower Net 5x5 ft','grower-net-5x5','Plant Support Materials','Net',220,'1 Piece'],
  ['pdf-ps-011','Grower Net 6x6 ft','Grower Net 6x6 ft','grower-net-6x6','Plant Support Materials','Net',245,'1 Piece'],
  ['pdf-ps-012','Net Stake Pack','Net Stake Pack','net-stake-pack','Plant Support Materials','Stake Pack',155,'Pack of 20'],
  ['pdf-ps-013','Cage Support 3 Tier','Cage Support 3 Tier','cage-support-3tier','Plant Support Materials','Cage Support',420,'1 Piece'],
  ['pdf-ps-014','Trellis Mesh 1m x 50m','Trellis Mesh 1m x 50m','trellis-mesh-1x50m','Plant Support Materials','Trellis Mesh',760,'1 Roll'],
  ['pdf-ps-015','Trellis Mesh 2m x 50m','Trellis Mesh 2m x 50m','trellis-mesh-2x50m','Plant Support Materials','Trellis Mesh',1250,'1 Roll'],
  ['pdf-ps-016','Basket Support 12 Inch','Basket Support 12 Inch','basket-support-12inch','Plant Support Materials','Basket Support',165,'1 Piece'],
  ['pdf-ps-017','Hanging Basket Chain Set','Hanging Basket Chain Set','hanging-basket-chain-set','Plant Support Materials','Hanging Chain',210,'Set of 3'],
  ['pdf-ps-018','Coconut Coir Rope 250m','Coconut Coir Rope 250m','coconut-coir-rope-250m','Plant Support Materials','Coir Rope',325,'250 m Roll'],
  ['pdf-ps-019','Palm Rope 100m','Palm Rope 100m','palm-rope-100m','Plant Support Materials','Palm Rope',138,'100 m Roll'],
  ['pdf-ps-020','Jute Twine 200m','Jute Twine 200m','jute-twine-200m','Plant Support Materials','Jute Twine',119,'200 m Roll'],
  ['pdf-ps-021','Heat Shrink Tape 10m','Heat Shrink Tape 10m','heat-shrink-tape-10m','Plant Support Materials','Heat Shrink Tape',145,'10 m Roll'],
  ['pdf-ps-022','WaterProof Graft Tape 30m','WaterProof Graft Tape 30m','waterproof-graft-tape-30m','Plant Support Materials','Graft Tape',158,'30 m Roll'],
  ['pdf-ps-023','Horticulture Twine 120m','Horticulture Twine 120m','horticulture-twine-120m','Plant Support Materials','Plant Twine',102,'120 m Roll'],
  ['pdf-ps-024','Drip Line Holder','Drip Line Holder','drip-line-holder','Plant Support Materials','Line Holder',95,'1 Pack'],
  ['pdf-ps-025','Garden Stake 2ft','Garden Stake 2ft','garden-stake-2ft','Plant Support Materials','Stake',84,'1 Piece'],
  ['pdf-ps-026','Garden Stake 3ft','Garden Stake 3ft','garden-stake-3ft','Plant Support Materials','Stake',96,'1 Piece'],
  ['pdf-ps-027','Garden Stake 4ft','Garden Stake 4ft','garden-stake-4ft','Plant Support Materials','Stake',125,'1 Piece'],
  ['pdf-ps-028','Tree Support Brace','Tree Support Brace','tree-support-brace','Plant Support Materials','Support Brace',295,'1 Piece'],
  ['pdf-ps-029','Propagation Label Set 100','Propagation Label Set 100','propagation-label-set-100','Plant Support Materials','Label Set',89,'Pack of 100'],
  ['pdf-ps-030','Plant Marker Board','Plant Marker Board','plant-marker-board','Plant Support Materials','Marker Board',210,'1 Piece'],
  ['pdf-ps-031','Plant Support Clamp 50','Plant Support Clamp 50','plant-support-clamp-50','Plant Support Materials','Support Clamp',255,'Pack of 50'],
  ['pdf-ps-032','Mesh Sleeve 1m','Mesh Sleeve 1m','mesh-sleeve-1m','Plant Support Materials','Mesh Sleeve',135,'1 Piece'],
  ['pdf-ps-033','Shade Net Clip 25','Shade Net Clip 25','shade-net-clip-25','Plant Support Materials','Shade Net Clip',79,'Pack of 25'],
  ['pdf-ps-034','Tomato Cage 12x12','Tomato Cage 12x12','tomato-cage-12x12','Plant Support Materials','Tomato Cage',425,'1 Piece'],
  ['pdf-at-001','Seed Tray 24 Cells','Seed Tray 24 Cells','seed-tray-24-cells','Agriculture Trays','Seed Tray',72,'1 Piece'],
  ['pdf-at-002','Seed Tray 32 Cells','Seed Tray 32 Cells','seed-tray-32-cells','Agriculture Trays','Seed Tray',82,'1 Piece'],
  ['pdf-at-003','Seed Tray 48 Cells','Seed Tray 48 Cells','seed-tray-48-cells','Agriculture Trays','Seed Tray',96,'1 Piece'],
  ['pdf-at-004','Raised Bed Tray 60x40','Raised Bed Tray 60x40','raised-bed-tray-60x40','Agriculture Trays','Raised Bed Tray',160,'1 Piece'],
  ['pdf-at-005','Raised Bed Tray 80x50','Raised Bed Tray 80x50','raised-bed-tray-80x50','Agriculture Trays','Raised Bed Tray',220,'1 Piece'],
  ['pdf-at-006','Mobile Nursery Tray','Mobile Nursery Tray','mobile-nursery-tray','Agriculture Trays','Mobile Tray',320,'1 Piece'],
  ['pdf-at-007','Germination Tray 96 Cells','Germination Tray 96 Cells','germination-tray-96-cells','Agriculture Trays','Germination Tray',118,'1 Piece'],
  ['pdf-at-008','Transplant Tray 30 Cells','Transplant Tray 30 Cells','transplant-tray-30-cells','Agriculture Trays','Transplant Tray',110,'1 Piece'],
  ['pdf-at-009','Plug Tray 128 Cells','Plug Tray 128 Cells','plug-tray-128-cells','Agriculture Trays','Plug Tray',132,'1 Piece'],
  ['pdf-at-010','Mini Tray 12 Cells','Mini Tray 12 Cells','mini-tray-12-cells','Agriculture Trays','Mini Tray',55,'1 Piece'],
  ['pdf-at-011','Microgreen Tray','Microgreen Tray','microgreen-tray','Agriculture Trays','Microgreen Tray',85,'1 Piece'],
  ['pdf-at-012','Hydroponic Tray 4ft','Hydroponic Tray 4ft','hydroponic-tray-4ft','Agriculture Trays','Hydroponic Tray',420,'1 Piece'],
  ['pdf-at-013','Hydroponic Tray 8ft','Hydroponic Tray 8ft','hydroponic-tray-8ft','Agriculture Trays','Hydroponic Tray',780,'1 Piece'],
  ['pdf-at-014','Seedling Plug Tray 40mm','Seedling Plug Tray 40mm','seedling-plug-tray-40mm','Agriculture Trays','Plug Tray',145,'1 Piece'],
  ['pdf-at-015','Multipurpose Tray','Multipurpose Tray','multipurpose-tray','Agriculture Trays','Multipurpose Tray',98,'1 Piece'],
  ['pdf-at-016','Stackable Tray Set 5','Stackable Tray Set 5','stackable-tray-set-5','Agriculture Trays','Stackable Tray',420,'Set of 5'],
  ['pdf-at-017','Tray Divider Kit','Tray Divider Kit','tray-divider-kit','Agriculture Trays','Tray Divider',115,'1 Kit'],
  ['pdf-tr-001','Plastic Reservoir Tank 100 L','Plastic Reservoir Tank 100 L','plastic-reservoir-tank-100l','Tanks & Reservoirs','Reservoir Tank',980,'100 L'],
  ['pdf-tr-002','Plastic Reservoir Tank 200 L','Plastic Reservoir Tank 200 L','plastic-reservoir-tank-200l','Tanks & Reservoirs','Reservoir Tank',1580,'200 L'],
  ['pdf-tr-003','Plastic Reservoir Tank 500 L','Plastic Reservoir Tank 500 L','plastic-reservoir-tank-500l','Tanks & Reservoirs','Reservoir Tank',3290,'500 L'],
  ['pdf-tr-004','HDPE Tank 1000 L','HDPE Tank 1000 L','hdpe-tank-1000l','Tanks & Reservoirs','HDPE Tank',7200,'1000 L'],
  ['pdf-tr-005','HDPE Tank 2000 L','HDPE Tank 2000 L','hdpe-tank-2000l','Tanks & Reservoirs','HDPE Tank',12950,'2000 L'],
  ['pdf-tr-006','Water Reservoir 50 L','Water Reservoir 50 L','water-reservoir-50l','Tanks & Reservoirs','Water Reservoir',730,'50 L'],
  ['pdf-tr-007','Fertilizer Tank 75 L','Fertilizer Tank 75 L','fertilizer-tank-75l','Tanks & Reservoirs','Fertilizer Tank',890,'75 L'],
  ['pdf-tr-008','Poly Tank 120 L','Poly Tank 120 L','poly-tank-120l','Tanks & Reservoirs','Poly Tank',1020,'120 L'],
  ['pdf-tr-009','Misting Reservoir 30 L','Misting Reservoir 30 L','misting-reservoir-30l','Tanks & Reservoirs','Misting Reservoir',640,'30 L'],
  ['pdf-tr-010','Storage Container 25 L','Storage Container 25 L','storage-container-25l','Tanks & Reservoirs','Storage Container',520,'25 L'],
  ['pdf-ir-001','Garden Hose 2 Ply 25mm','Garden Hose 2 Ply 25mm','garden-hose-2ply-25mm','Pumps & Irrigation','Garden Hose',210,'25 mm'],
  ['pdf-ir-002','Garden Hose 2 Ply 32mm','Garden Hose 2 Ply 32mm','garden-hose-2ply-32mm','Pumps & Irrigation','Garden Hose',320,'32 mm'],
  ['pdf-ir-003','Color Garden Hose 25mm','Color Garden Hose 25mm','color-garden-hose-25mm','Pumps & Irrigation','Garden Hose',255,'25 mm'],
  ['pdf-ir-004','Color Garden Hose 32mm','Color Garden Hose 32mm','color-garden-hose-32mm','Pumps & Irrigation','Garden Hose',365,'32 mm'],
  ['pdf-ir-005','Conductive PVC Pipe 20mm','Conductive PVC Pipe 20mm','conductive-pvc-pipe-20mm','Pumps & Irrigation','PVC Pipe',85,'20 mm/meter'],
  ['pdf-ir-006','Conductive PVC Pipe 25mm','Conductive PVC Pipe 25mm','conductive-pvc-pipe-25mm','Pumps & Irrigation','PVC Pipe',98,'25 mm/meter'],
  ['pdf-ir-007','Conductive PVC Pipe 32mm','Conductive PVC Pipe 32mm','conductive-pvc-pipe-32mm','Pumps & Irrigation','PVC Pipe',125,'32 mm/meter'],
  ['pdf-ir-008','Agriculture Pipe 20mm','Agriculture Pipe 20mm','agriculture-pipe-20mm','Pumps & Irrigation','Agriculture Pipe',90,'20 mm/meter'],
  ['pdf-ir-009','Agriculture Pipe 25mm','Agriculture Pipe 25mm','agriculture-pipe-25mm','Pumps & Irrigation','Agriculture Pipe',108,'25 mm/meter'],
  ['pdf-ir-010','Agriculture Pipe 32mm','Agriculture Pipe 32mm','agriculture-pipe-32mm','Pumps & Irrigation','Agriculture Pipe',138,'32 mm/meter'],
  ['pdf-ir-011','HDPE Tube 16mm','HDPE Tube 16mm','hdpe-tube-16mm','Pumps & Irrigation','HDPE Tube',92,'16 mm/meter'],
  ['pdf-ir-012','HDPE Tube 20mm','HDPE Tube 20mm','hdpe-tube-20mm','Pumps & Irrigation','HDPE Tube',120,'20 mm/meter'],
  ['pdf-ir-013','HDPE Tube 25mm','HDPE Tube 25mm','hdpe-tube-25mm','Pumps & Irrigation','HDPE Tube',145,'25 mm/meter'],
  ['pdf-ir-014','HDPE Tube 32mm','HDPE Tube 32mm','hdpe-tube-32mm','Pumps & Irrigation','HDPE Tube',198,'32 mm/meter'],
  ['pdf-ir-015','PVC Main Pipe 40mm','PVC Main Pipe 40mm','pvc-main-pipe-40mm','Pumps & Irrigation','PVC Main Pipe',225,'40 mm/meter'],
  ['pdf-ir-016','PVC Main Pipe 50mm','PVC Main Pipe 50mm','pvc-main-pipe-50mm','Pumps & Irrigation','PVC Main Pipe',265,'50 mm/meter'],
  ['pdf-ir-017','PVC Main Pipe 63mm','PVC Main Pipe 63mm','pvc-main-pipe-63mm','Pumps & Irrigation','PVC Main Pipe',320,'63 mm/meter'],
  ['pdf-ir-018','Low Flow Drip Irrigation Pipe 16mm','Low Flow Drip Irrigation Pipe 16mm','low-flow-drip-irrigation-pipe-16mm','Pumps & Irrigation','Drip Pipe',92,'16 mm/meter'],
  ['pdf-ir-019','Low Flow Drip Irrigation Pipe 20mm','Low Flow Drip Irrigation Pipe 20mm','low-flow-drip-irrigation-pipe-20mm','Pumps & Irrigation','Drip Pipe',118,'20 mm/meter'],
  ['pdf-ir-020','Low Flow Drip Irrigation Pipe 25mm','Low Flow Drip Irrigation Pipe 25mm','low-flow-drip-irrigation-pipe-25mm','Pumps & Irrigation','Drip Pipe',145,'25 mm/meter'],
  ['pdf-ir-021','Sprinkler Pipe 25mm','Sprinkler Pipe 25mm','sprinkler-pipe-25mm','Pumps & Irrigation','Sprinkler Pipe',170,'25 mm/meter'],
  ['pdf-ir-022','Sprinkler Pipe 32mm','Sprinkler Pipe 32mm','sprinkler-pipe-32mm','Pumps & Irrigation','Sprinkler Pipe',205,'32 mm/meter'],
  ['pdf-ir-023','Subsurface Drip Tape 20mm','Subsurface Drip Tape 20mm','subsurface-drip-tape-20mm','Pumps & Irrigation','Drip Tape',115,'20 mm/meter'],
  ['pdf-ir-024','Subsurface Drip Tape 25mm','Subsurface Drip Tape 25mm','subsurface-drip-tape-25mm','Pumps & Irrigation','Drip Tape',145,'25 mm/meter'],
  ['pdf-ir-025','Micro Sprinkler Set 10','Micro Sprinkler Set 10','micro-sprinkler-set-10','Pumps & Irrigation','Micro Sprinkler',1320,'Set of 10'],
  ['pdf-ir-026','Sprinkler Nozzle Pack 10','Sprinkler Nozzle Pack 10','sprinkler-nozzle-pack-10','Pumps & Irrigation','Nozzle Pack',540,'Pack of 10'],
  ['pdf-ir-027','Long Drain Pipe 50mm','Long Drain Pipe 50mm','long-drain-pipe-50mm','Pumps & Irrigation','Drain Pipe',380,'50 mm/meter'],
  ['pdf-ir-028','Lawn Sprinkler System','Lawn Sprinkler System','lawn-sprinkler-system','Pumps & Irrigation','Sprinkler Kit',1450,'1 Set'],
  ['pdf-ir-029','Garden Irrigation Kit','Garden Irrigation Kit','garden-irrigation-kit','Pumps & Irrigation','Irrigation Kit',950,'1 Kit'],
  ['pdf-ir-030','Water Gun 1.5 Inch','Water Gun 1.5 Inch','water-gun-1-5-inch','Pumps & Irrigation','Water Gun',390,'1 Piece'],
  ['pdf-ir-031','Water Gun 2 Inch','Water Gun 2 Inch','water-gun-2-inch','Pumps & Irrigation','Water Gun',480,'1 Piece'],
  ['pdf-ir-032','Water Spray Gun','Water Spray Gun','water-spray-gun','Pumps & Irrigation','Spray Gun',290,'1 Piece'],
  ['pdf-ir-033','Water Spray Lance','Water Spray Lance','water-spray-lance','Pumps & Irrigation','Spray Lance',525,'1 Piece'],
  ['pdf-ir-034','Water Gun Nozzle Set','Water Gun Nozzle Set','water-gun-nozzle-set','Pumps & Irrigation','Nozzle Set',245,'Set of 5'],
  ['pdf-ir-035','Portable Pump 0.5 HP','Portable Pump 0.5 HP','portable-pump-0-5-hp','Pumps & Irrigation','Portable Pump',3720,'0.5 HP'],
  ['pdf-ir-036','Portable Pump 1 HP','Portable Pump 1 HP','portable-pump-1-hp','Pumps & Irrigation','Portable Pump',5620,'1 HP'],
  ['pdf-ir-037','Submersible Pump 0.75 HP','Submersible Pump 0.75 HP','submersible-pump-0-75-hp','Pumps & Irrigation','Submersible Pump',7680,'0.75 HP'],
  ['pdf-ir-038','Drip Irrigation Valve','Drip Irrigation Valve','drip-irrigation-valve','Pumps & Irrigation','Valve',175,'1 Piece'],
  ['pdf-ir-039','Solenoid Valve 24V','Solenoid Valve 24V','solenoid-valve-24v','Pumps & Irrigation','Solenoid Valve',320,'1 Piece'],
  ['pdf-ir-040','Garden Spray Pump 12V','Garden Spray Pump 12V','garden-spray-pump-12v','Pumps & Irrigation','Spray Pump',1850,'1 Piece'],
  ['pdf-ir-041','Drip Irrigation Filter 2 Inch','Drip Irrigation Filter 2 Inch','drip-irrigation-filter-2inch','Pumps & Irrigation','Filter',490,'1 Piece'],
  ['pdf-ir-042','Fertilizer Injector Set','Fertilizer Injector Set','fertilizer-injector-set','Pumps & Irrigation','Injector Set',1290,'1 Set'],
  ['pdf-ir-043','Pressure Regulating Valve','Pressure Regulating Valve','pressure-regulating-valve','Pumps & Irrigation','Pressure Valve',715,'1 Piece'],
  ['pdf-ir-044','PVC Elbow 90° 25mm','PVC Elbow 90° 25mm','pvc-elbow-90-25mm','Pumps & Irrigation','PVC Elbow',45,'1 Piece'],
  ['pdf-ir-045','PVC Tee 25mm','PVC Tee 25mm','pvc-tee-25mm','Pumps & Irrigation','PVC Tee',55,'1 Piece'],
  ['pdf-ir-046','Hydroponic Grow Light 40W','Hydroponic Grow Light 40W','hydroponic-grow-light-40w','Grow Lights','Grow Light',2490,'1 Piece'],
  ['pdf-ir-047','Plant LED Panel 20W','Plant LED Panel 20W','plant-led-panel-20w','Grow Lights','LED Panel',1790,'1 Piece'],
  ['pdf-ir-048','Soil Moisture Sensor','Soil Moisture Sensor','soil-moisture-sensor','Grow Lights','Sensor',950,'1 Piece'],
  ['pdf-ir-049','Plastic Spray Bottle 1L','Plastic Spray Bottle 1L','plastic-spray-bottle-1l','Pumps & Irrigation','Spray Bottle',85,'1 Piece'],
];

const ADDITIONAL_PDF_PRODUCTS = buildAdditionalProducts(ADDITIONAL_PDF_PRODUCT_SPECS);

export const PDF_PRODUCTS: Product[] = [

  // ─── POTS & PLANTERS ───────────────────────────────────────────────────────
  {
    id: 'pdf-p-001', name: 'IGO FRP Fiber Pot – 12 Inch', displayName: 'FRP Fiber Pot 12"',
    slug: 'igo-frp-fiber-pot-12inch', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Pots & Planters', price: 349, mrp: 450, discount: 22, stock: 200,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'Fiber Reinforced Plastic (FRP) pot — UV-stabilized, lightweight and unbreakable. Ideal for terrace gardens, balconies and indoor spaces. Weather and heat resistant for Chennai climate.',
    composition: 'Fiber Reinforced Plastic (FRP); UV-stabilized coating.', usage: 'Fill with well-draining potting mix. Suitable for flowering plants, herbs, small shrubs.',
    rating: 4.6, reviewCount: 112, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['frp', 'pot', 'planter', 'terrace', 'balcony'], unit: '1 Piece', isOrganic: false, crops: ['Flowering plants', 'Herbs', 'Shrubs']
  },
  {
    id: 'pdf-p-002', name: 'IGO FRP Fiber Pot – 18 Inch', displayName: 'FRP Fiber Pot 18"',
    slug: 'igo-frp-fiber-pot-18inch', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Pots & Planters', price: 649, mrp: 850, discount: 24, stock: 150,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'Large 18-inch FRP pot for dwarf fruit trees, large ornamentals and terrace vegetable growing. UV-stabilized and extremely durable.',
    composition: 'Fiber Reinforced Plastic (FRP); UV-stabilized.', usage: 'Ideal for Moringa, Curry Leaf, Papaya, Hibiscus and large ornamentals.',
    rating: 4.7, reviewCount: 87, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['frp', 'pot', 'large', 'terrace', 'fruit-trees'], unit: '1 Piece', isOrganic: false, crops: ['Fruit trees', 'Ornamentals']
  },
  {
    id: 'pdf-p-003', name: 'Terracotta Pot – 8 Inch (Plain)', displayName: 'Terracotta Pot 8"',
    slug: 'terracotta-pot-8inch', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Pots & Planters', price: 89, mrp: 120, discount: 26, stock: 500,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'High-grade baked terracotta clay pot — porous walls promote healthy root aeration and prevent waterlogging. Traditional choice for herbs, succulents and indoor plants.',
    composition: 'High-grade baked clay; natural terracotta.', usage: 'Excellent for Tulsi, Aloe Vera, succulents and balcony herbs. Clean with dry cloth.',
    rating: 4.5, reviewCount: 203, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['terracotta', 'clay-pot', 'natural', 'herbs'], unit: '1 Piece', isOrganic: false, crops: ['Herbs', 'Succulents', 'Indoor plants']
  },
  {
    id: 'pdf-p-004', name: 'Terracotta Pot – 12 Inch (Painted)', displayName: 'Terracotta Pot 12" Painted',
    slug: 'terracotta-pot-12inch-painted', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Pots & Planters', price: 175, mrp: 240, discount: 27, stock: 300,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'Hand-painted 12-inch terracotta pot with decorative motifs. Combines traditional craftsmanship with functional plant growing.',
    composition: 'High-grade baked clay; UV-stable paint finish.', usage: 'Ideal for medium shrubs, Jasmine, flowering plants and kitchen herbs.',
    rating: 4.6, reviewCount: 145, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['terracotta', 'painted', 'decorative', 'pot'], unit: '1 Piece', isOrganic: false, crops: ['Flowering plants', 'Herbs']
  },
  {
    id: 'pdf-p-005', name: 'Fabric Grow Bag – 20×20 cm', displayName: 'Fabric Grow Bag 20×20',
    slug: 'fabric-grow-bag-20x20', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 60, mrp: 80, discount: 25, stock: 1000,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'Breathable non-woven fabric grow bag — promotes air pruning of roots for healthier, denser root systems. Reusable and washable.',
    composition: 'Non-woven breathable fabric; BPA-free.', usage: 'Fill with cocopeat + potting mix blend. Best for tomatoes, chillis, herbs and microgreens.',
    rating: 4.7, reviewCount: 318, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['fabric', 'grow-bag', 'reusable', 'air-pruning'], unit: 'Pack of 5', isOrganic: false, crops: ['Tomato', 'Chilli', 'Herbs']
  },
  {
    id: 'pdf-p-006', name: 'Fabric Grow Bag – 30×30 cm', displayName: 'Fabric Grow Bag 30×30',
    slug: 'fabric-grow-bag-30x30', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 100, mrp: 135, discount: 26, stock: 800,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'Medium fabric grow bag — perfect for single tomato plants, brinjal, capsicum or curry leaf plants in terrace gardens.',
    composition: 'Non-woven breathable fabric; BPA-free.', usage: 'Single plant per bag. Use drip or watering can for irrigation.',
    rating: 4.8, reviewCount: 276, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['fabric', 'grow-bag', 'medium', 'terrace'], unit: 'Pack of 5', isOrganic: false, crops: ['Tomato', 'Brinjal', 'Capsicum']
  },
  {
    id: 'pdf-p-007', name: 'Fabric Grow Bag – 45×45 cm (Large)', displayName: 'Fabric Grow Bag 45×45 Large',
    slug: 'fabric-grow-bag-45x45', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 190, mrp: 250, discount: 24, stock: 400,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'Large fabric grow bag for small fruit trees, banana, papaya and Moringa. Air-pruning fabric technology keeps roots healthy.',
    composition: 'Heavy-duty non-woven breathable fabric.', usage: 'Use for dwarf banana, papaya, moringa or large ornamental shrubs.',
    rating: 4.7, reviewCount: 189, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['fabric', 'grow-bag', 'large', 'fruit-tree'], unit: '1 Piece', isOrganic: false, crops: ['Banana', 'Papaya', 'Moringa']
  },
  {
    id: 'pdf-p-008', name: 'Self-Watering Pot – 10 Inch', displayName: 'Self-Watering Pot 10"',
    slug: 'self-watering-pot-10inch', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 299, mrp: 399, discount: 25, stock: 250,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'Virgin Polypropylene self-watering pot with wicking reservoir — reduces watering frequency by up to 50%. Ideal for working professionals and frequent travelers.',
    composition: 'Virgin Polypropylene (PP); food-safe plastic.', usage: 'Fill reservoir every 7–10 days. Best for peace lily, pothos and kitchen herbs.',
    rating: 4.5, reviewCount: 134, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['self-watering', 'pot', 'low-maintenance', 'indoor'], unit: '1 Piece', isOrganic: false, crops: ['Indoor plants', 'Herbs']
  },
  {
    id: 'pdf-p-009', name: 'HDPE Grow Bag – 40×24×24 cm', displayName: 'HDPE Grow Bag 40×24×24',
    slug: 'hdpe-grow-bag-40x24x24', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 45, mrp: 60, discount: 25, stock: 2000,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'UV-stabilized HDPE grow bag — 200 GSM heavy-duty thickness for long-lasting use. Widely used for terrace vegetable farming across Chennai.',
    composition: 'UV-stabilized HDPE; 200-400 GSM.', usage: 'Fill with cocopeat mix. Suitable for gourds, tomatoes, brinjal, leafy greens.',
    rating: 4.6, reviewCount: 421, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['hdpe', 'grow-bag', 'uv-stabilized', 'vegetable'], unit: '1 Piece', isOrganic: false, crops: ['Vegetables', 'Gourds']
  },
  {
    id: 'pdf-p-010', name: 'Coir Hanging Basket – 10 Inch', displayName: 'Coir Hanging Basket 10"',
    slug: 'coir-hanging-basket-10inch', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 199, mrp: 260, discount: 23, stock: 300,
    images: ['/catalog/nursery-essentials/cocopeat.png'],
    description: 'GI wire frame hanging basket with molded coconut fiber liner — natural, breathable and biodegradable. Gives a rustic premium look to balconies and gardens.',
    composition: 'GI wire frame + molded coir fiber liner.', usage: 'Plant trailing varieties like Portulaca, Petunia, Sweet potato vine. Water daily.',
    rating: 4.7, reviewCount: 156, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['coir', 'hanging-basket', 'balcony', 'trailing-plants'], unit: '1 Piece', isOrganic: true, crops: ['Trailing plants', 'Flowering plants']
  },
  {
    id: 'pdf-p-011', name: 'Wrought Iron Hanging Basket – 12 Inch', displayName: 'Wrought Iron Hanging Basket 12"',
    slug: 'wrought-iron-hanging-basket-12inch', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 549, mrp: 750, discount: 27, stock: 120,
    images: ['/catalog/nursery-essentials/cocopeat.png'],
    description: 'Solid heavy-gauge wrought iron hanging basket with antique powder-coat finish. Premium, rust-resistant and long-lasting for outdoor use.',
    composition: 'Solid heavy-gauge iron; antique powder-coated finish.', usage: 'Line with coir or moss before filling with potting mix.',
    rating: 4.8, reviewCount: 67, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['wrought-iron', 'hanging-basket', 'premium', 'antique'], unit: '1 Piece', isOrganic: false, crops: ['Flowering plants']
  },
  {
    id: 'pdf-p-012', name: 'Balcony Rail Planter', displayName: 'Balcony Rail Planter',
    slug: 'balcony-rail-planter', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 140, mrp: 190, discount: 26, stock: 400,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'Virgin plastic saddle planter that clips securely over balcony railings and grills. No drilling required — perfect for apartment gardening.',
    composition: 'Virgin Polypropylene; UV-stabilized.', usage: 'Hook over 25–40mm balcony railing. Plant herbs or small flowering plants.',
    rating: 4.5, reviewCount: 198, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['balcony', 'railing-planter', 'apartment', 'no-drilling'], unit: '1 Piece', isOrganic: false, crops: ['Herbs', 'Flowering plants']
  },
  {
    id: 'pdf-p-013', name: 'Coir Pot – 6 Inch (Pack of 50)', displayName: 'Coir Pots 6" – Pack of 50',
    slug: 'coir-pot-6inch-pack50', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 2363, mrp: 3000, discount: 21, stock: 80,
    images: ['/catalog/nursery-essentials/cocopeat.png'],
    description: 'Compressed coconut fiber biodegradable pots — 100% eco-friendly. Entire pot can be planted directly in the ground; roots break through the coir as they grow. Wholesale pack of 50.',
    composition: 'Compressed coconut fiber; 100% biodegradable.', usage: 'Plant seedling in pot, then transplant pot-and-all into soil or larger container.',
    rating: 4.8, reviewCount: 94, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['coir-pot', 'biodegradable', 'eco-friendly', 'seedling'], unit: 'Pack of 50', isOrganic: true, crops: ['Seedlings', 'Transplants']
  },
  {
    id: 'pdf-p-014', name: 'Grow Bag – 9 Inch Round (Pack of 10)', displayName: 'Grow Bag 9" Round – Pack of 10',
    slug: 'grow-bag-9inch-pack10', brand: 'IGO Agri TechFarms', category: 'Pots & Planters',
    subcategory: 'Nursery & Garden Essentials', price: 199, mrp: 260, discount: 23, stock: 600,
    images: ['/catalog/nursery-essentials/nursery-pots.jpg'],
    description: 'UV-stabilized HDPE round grow bag for nursery and home gardening. Standard 9-inch size for single herb plants and seedlings.',
    composition: 'UV-stabilized HDPE; 200 GSM.', usage: 'Used for single herb plants, saplings, small shrubs. Provides excellent drainage.',
    rating: 4.5, reviewCount: 267, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['grow-bag', 'hdpe', 'nursery', 'herbs'], unit: 'Pack of 10', isOrganic: false, crops: ['Herbs', 'Saplings']
  },
  {
    id: 'pdf-ah-001', name: 'Cattle Feed Supplement', displayName: 'Cattle Feed Supplement',
    slug: 'cattle-feed-supplement', brand: 'IGO Livestock Care', category: 'Animal Husbandry',
    subcategory: 'Animal Husbandry', price: 440, mrp: 550, discount: 20, stock: 220,
    images: ['/catalog/animal-husbandry/cattle.webp'],
    description: 'High-protein cattle feed supplement blended with minerals and vitamins to improve milk yield, weight gain and overall animal health.',
    composition: 'Soy protein meal, maize, mineral mix, probiotics.', usage: 'Mix with cattle concentrate or silage at 2 kg per animal per day. Suitable for dairy and draft cattle.',
    rating: 4.8, reviewCount: 94, isIgoOwn: true, problemFilter: 'Animal Nutrition',
    tags: ['cattle-feed', 'livestock', 'dairy', 'nutrition'], unit: '25 kg bag', isOrganic: false, crops: ['Dairy Cattle', 'Beef Cattle']
  },
  {
    id: 'pdf-ah-002', name: 'Poultry Starter Mash', displayName: 'Poultry Starter Mash',
    slug: 'poultry-starter-mash', brand: 'IGO Livestock Care', category: 'Animal Husbandry',
    subcategory: 'Animal Husbandry', price: 360, mrp: 450, discount: 20, stock: 180,
    images: ['/catalog/animal-husbandry/poultry.webp'],
    description: 'Balanced starter mash for chicks and young poultry, formulated to support rapid growth, strong bones and healthy immunity.',
    composition: 'Corn, soybean, wheat, vitamins, minerals, amino acids.', usage: 'Feed ad libitum to chicks and broilers. Use clean feed trays and fresh drinking water.',
    rating: 4.7, reviewCount: 72, isIgoOwn: true, problemFilter: 'Animal Nutrition',
    tags: ['poultry-feed', 'starter-mash', 'broiler', 'layer'], unit: '20 kg bag', isOrganic: false, crops: ['Poultry']
  },
  {
    id: 'pdf-ah-003', name: 'Goat Shed Mesh Net', displayName: 'Goat Shed Mesh Net',
    slug: 'goat-shed-mesh-net', brand: 'IGO Livestock Care', category: 'Animal Husbandry',
    subcategory: 'Animal Husbandry', price: 780, mrp: 980, discount: 20, stock: 120,
    images: ['/catalog/animal-husbandry/goat-farm.webp'],
    description: 'Heavy-duty mesh net for goat sheds, providing ventilation while protecting animals from insects and overhead debris.',
    composition: 'Polyethylene mesh with UV stabilizer.', usage: 'Install across sidewalls and roof openings of goat sheds. Clean periodically and inspect for tears.',
    rating: 4.6, reviewCount: 54, isIgoOwn: true, problemFilter: 'Animal Shelter',
    tags: ['goat', 'shelter', 'mesh-net', 'livestock'], unit: '1 Roll 10m', isOrganic: false, crops: ['Goat', 'Sheep']
  },
  {
    id: 'pdf-ah-004', name: 'Fish Pond Aerator Kit', displayName: 'Fish Pond Aerator Kit',
    slug: 'fish-pond-aerator-kit', brand: 'IGO Livestock Care', category: 'Animal Husbandry',
    subcategory: 'Animal Husbandry', price: 2490, mrp: 3100, discount: 20, stock: 90,
    images: ['/catalog/animal-husbandry/fish-farming.webp'],
    description: 'Compact aerator kit for fish ponds and aquaculture tanks. Improves dissolved oxygen levels for healthier tilapia, carp and freshwater species.',
    composition: 'Electric aerator pump with diffuser stones and stainless steel tubing.', usage: 'Install near pond edge with power supply. Operate 8-10 hours daily during warm months.',
    rating: 4.8, reviewCount: 39, isIgoOwn: true, problemFilter: 'Aquaculture',
    tags: ['fish-farming', 'aerator', 'aquaculture', 'pond'], unit: '1 Kit', isOrganic: false, crops: ['Fish', 'Aquaculture']
  },

  // ─── HYDROPONIC SYSTEMS ───────────────────────────────────────────────────
  {
    id: 'pdf-h-001', name: 'IGO Grow Tower – 48 Planter System', displayName: 'Grow Tower 48 Planter',
    slug: 'igo-grow-tower-48-planter', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 9000, mrp: 11500, discount: 22, stock: 30,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Vertical hydroponic grow tower with 48 planting spots — ideal for leafy greens, herbs and strawberries. Complete with pump, timer and fittings. Best suited for Chennai terrace gardens and indoor growing.',
    composition: 'Food-grade PVC/ABS tower sections; submersible pump; drip fittings included.', usage: 'Set up vertically with provided pump. Grow lettuce, spinach, basil, mint and strawberries.',
    rating: 4.8, reviewCount: 43, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['hydroponic', 'vertical-tower', 'leafy-greens', 'indoor-farming'], unit: '1 Set (48 planters)', isOrganic: false, crops: ['Lettuce', 'Spinach', 'Basil', 'Herbs']
  },
  {
    id: 'pdf-h-002', name: 'IGO Grow Tower – 72 Planter System', displayName: 'Grow Tower 72 Planter',
    slug: 'igo-grow-tower-72-planter', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 12500, mrp: 16000, discount: 22, stock: 20,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Expanded 72-planter vertical grow tower for higher-yield home and commercial growing. Perfect for restaurants, cafes and urban farms.',
    composition: 'Food-grade PVC/ABS tower; submersible pump; complete drip kit.', usage: 'Ideal for restaurants, cafes and high-production home setups.',
    rating: 4.9, reviewCount: 28, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['hydroponic', 'vertical-tower', 'commercial', 'urban-farm'], unit: '1 Set (72 planters)', isOrganic: false, crops: ['Leafy greens', 'Herbs', 'Strawberry']
  },
  {
    id: 'pdf-h-003', name: 'IGO Green Pet Hydroponic System – 20 Planter', displayName: 'Green Pet System 20 Planter',
    slug: 'igo-green-pet-system-20', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 6000, mrp: 7800, discount: 23, stock: 40,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Compact Green Pet hydroponic system with 20 growing spots — perfect starter system for home kitchens, offices and balconies. Includes timer and nutrient pump.',
    composition: 'Food-grade PVC/PP; pump; timer; net pots included.', usage: 'Grow basil, mint, coriander, lettuce, spinach. Change nutrient solution weekly.',
    rating: 4.7, reviewCount: 62, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['hydroponic', 'compact', 'beginner', 'kitchen-garden'], unit: '1 Set (20 planters)', isOrganic: false, crops: ['Basil', 'Mint', 'Coriander', 'Lettuce']
  },
  {
    id: 'pdf-h-004', name: 'IGO HOBBY Hydroponic System – 40 Planter', displayName: 'HOBBY System 40 Planter',
    slug: 'igo-hobby-system-40', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 4650, mrp: 6000, discount: 22, stock: 45,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Affordable HOBBY-series hydroponic system for beginners — 40 planting holes, easy assembly, with nutrient pump and basic fittings.',
    composition: 'Food-grade PP channels; pump; end caps; net pots.', usage: 'Great for first-time hydroponic growers. Grow herbs and leafy greens with ease.',
    rating: 4.6, reviewCount: 78, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['hydroponic', 'hobby', 'beginner', 'affordable'], unit: '1 Set (40 planters)', isOrganic: false, crops: ['Herbs', 'Leafy greens']
  },
  {
    id: 'pdf-h-005', name: 'Flat Bed NFT Hydroponic System – 60 Planter', displayName: 'Flat Bed NFT 60 Planter',
    slug: 'flat-bed-nft-system-60', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 16275, mrp: 21000, discount: 22, stock: 15,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Nutrient Film Technique (NFT) flat bed system with 60 planting holes — commercial-grade setup for rooftop farms and serious urban growers.',
    composition: 'NFT channels (3.5 inch); pump; reservoir; complete fittings.', usage: 'Suitable for lettuce, herbs, baby spinach. Used in commercial urban farms.',
    rating: 4.9, reviewCount: 19, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['nft', 'hydroponic', 'commercial', 'rooftop-farm'], unit: '1 Set (60 planters)', isOrganic: false, crops: ['Lettuce', 'Herbs', 'Spinach']
  },
  {
    id: 'pdf-h-006', name: 'Dutch Bucket Hydroponic System – 10 Planter', displayName: 'Dutch Bucket System 10 Planter',
    slug: 'dutch-bucket-system-10', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 11200, mrp: 14500, discount: 23, stock: 20,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Dutch Bucket (Bato Bucket) system for growing heavy fruiting plants like tomato, cucumber and capsicum hydroponically. Commercial and home-farm grade.',
    composition: '10 Dutch buckets (16L each); drip manifold; pump; timer; fittings.', usage: 'Ideal for determinate tomatoes, capsicum, cucumber and eggplant.',
    rating: 4.8, reviewCount: 34, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['dutch-bucket', 'hydroponic', 'tomato', 'fruiting-plants'], unit: '1 Set (10 buckets)', isOrganic: false, crops: ['Tomato', 'Capsicum', 'Cucumber']
  },
  {
    id: 'pdf-h-007', name: 'IGO Microgreen Hydroponic System – 9 Tray', displayName: 'Microgreen System 9 Tray',
    slug: 'microgreen-system-9-tray', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 16800, mrp: 21500, discount: 22, stock: 18,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Complete 9-tray microgreen growing system with LED grow light, timer and nutrient circulation. Grow fresh microgreens year-round in your kitchen or balcony.',
    composition: '9 microgreen trays; circulation pump; LED grow light; timer; nutrient solution kit.', usage: 'Grow wheat grass, radish, sunflower, peas and broccoli microgreens in 7–14 days.',
    rating: 4.9, reviewCount: 27, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['microgreen', 'hydroponic', 'indoor', 'health-food'], unit: '1 Set (9 trays)', isOrganic: false, crops: ['Microgreens']
  },
  {
    id: 'pdf-h-008', name: 'DWC Deep Water Culture Tray – 650×650mm', displayName: 'DWC Tray Small (2×2 ft)',
    slug: 'dwc-tray-small-650mm', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 1534, mrp: 2000, discount: 23, stock: 60,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Deep Water Culture (DWC) tray — food-grade, 70mm depth. Oxygen-rich nutrient solution keeps roots constantly fed. Simple and highly productive beginner system.',
    composition: 'Food-grade PP; 650×650×70mm; drilled for 2-inch net pots.', usage: 'Add nutrient solution + air pump + air stone. Grow lettuce, kale, spinach.',
    rating: 4.6, reviewCount: 51, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['dwc', 'deep-water-culture', 'hydroponic', 'leafy-greens'], unit: '1 Tray', isOrganic: false, crops: ['Lettuce', 'Kale', 'Spinach']
  },
  {
    id: 'pdf-h-009', name: 'NFT Channel 3.5 Inch – Per Metre', displayName: 'NFT Channel 3.5"',
    slug: 'nft-channel-3-5-inch', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 240, mrp: 310, discount: 23, stock: 500,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Food-grade 3.5-inch NFT channel for nutrient film technique systems. Compatible with 2-inch net pots. Scalable for small home or large commercial setups.',
    composition: 'Food-grade PVC; 3.5 inch diameter; UV-stabilized.', usage: 'Connect with end caps, pump and reservoir. MOQ 30 metres for project builds.',
    rating: 4.5, reviewCount: 38, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['nft-channel', 'hydroponic', 'pvc', 'scalable'], unit: 'Per Metre (MOQ 30m)', isOrganic: false, crops: ['Herbs', 'Leafy greens']
  },
  {
    id: 'pdf-h-010', name: 'Microgreen Tray 600×300mm (with drainage holes)', displayName: 'Microgreen Tray 600×300',
    slug: 'microgreen-tray-600x300-holes', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Nursery & Garden Essentials', price: 125, mrp: 165, discount: 24, stock: 500,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Standard microgreen growing tray with drainage holes — 600×300×30mm. Pairs with solid bottom tray for moisture control. BPA-free food-grade plastic.',
    composition: 'Food-grade PP; BPA-free; 600×300×30mm.', usage: 'Fill with cocopeat or jute mat. Sow seeds densely. Harvest in 7–14 days.',
    rating: 4.7, reviewCount: 142, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['microgreen', 'tray', 'growing-tray', 'food-grade'], unit: '1 Tray', isOrganic: false, crops: ['Microgreens']
  },
  {
    id: 'pdf-h-011', name: 'Seedling Tray – 102 Cavity', displayName: 'Seedling Tray 102 Cavity',
    slug: 'seedling-tray-102-cavity', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Nursery & Garden Essentials', price: 12, mrp: 18, discount: 33, stock: 1000,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Standard 102-cavity seedling propagation tray for mass germination of vegetables, herbs and flowers. Reusable and easy to clean.',
    composition: 'Lightweight PP plastic; food-safe.', usage: 'Fill with cocopith discs or germination mix. Sow one seed per cavity.',
    rating: 4.4, reviewCount: 289, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['seedling-tray', 'propagation', '102-cavity', 'germination'], unit: '1 Tray', isOrganic: false, crops: ['All crops']
  },

  // ─── GROW MEDIA & SUBSTRATES ───────────────────────────────────────────────
  {
    id: 'pdf-m-001', name: 'Cocopeat Block 5 KG – Low EC Washed', displayName: 'Cocopeat Block 5 KG',
    slug: 'cocopeat-block-5kg-low-ec', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 350, mrp: 470, discount: 26, stock: 300,
    images: ['/catalog/nursery-essentials/cocopeat.png'],
    description: 'Premium low-EC washed cocopeat block — expands to ~60–70L when soaked. EC <1.0, pH 5.8–6.5. Ideal base medium for all container gardening, hydroponics and seed germination.',
    composition: 'Processed coconut husk pith; low-EC (<1.0); pH 5.8–6.5; washed and buffered.', usage: 'Soak block in water for 30 minutes; break apart; mix with perlite or vermicompost.',
    rating: 4.9, reviewCount: 342, isIgoOwn: true, problemFilter: 'Soil Health',
    tags: ['cocopeat', 'grow-media', 'substrate', 'hydroponic'], unit: '5 KG Block (~65L)', isOrganic: true, crops: ['All crops']
  },
  {
    id: 'pdf-m-002', name: 'LECA Clay Balls 8–15mm – 50L Bag', displayName: 'LECA Clay Balls 8–15mm',
    slug: 'leca-clay-balls-8-15mm-50l', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 826, mrp: 1100, discount: 25, stock: 150,
    images: ['/catalog/nursery-essentials/Cocopeat%20(germinating%20medium).jpg'],
    description: 'Lightweight Expanded Clay Aggregate (LECA) — 8–15mm size. Reusable, pH-neutral and provides excellent drainage and aeration for hydroponics and potted plants.',
    composition: 'Kiln-fired expanded clay; pH neutral; pore size 8–15mm.', usage: 'Rinse well before use. Use as standalone hydroponic media or as drainage layer in pots.',
    rating: 4.8, reviewCount: 178, isIgoOwn: true, problemFilter: 'Soil Health',
    tags: ['leca', 'clay-balls', 'hydroponic-media', 'reusable'], unit: '50L Bag', isOrganic: false, crops: ['All crops']
  },
  {
    id: 'pdf-m-003', name: 'Horticultural Perlite 0.5–4mm – 10 KG Bag', displayName: 'Perlite 0.5–4mm 10KG',
    slug: 'hort-perlite-10kg', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 1062, mrp: 1400, discount: 24, stock: 200,
    images: ['/catalog/nursery-essentials/Cocopeat%20(germinating%20medium).jpg'],
    description: 'Premium horticultural-grade perlite — volcanic mineral that improves drainage and aeration in potting mixes. Lightweight; prevents soil compaction. Essential for cocopeat-based mixes.',
    composition: 'Expanded volcanic perlite; 0.5–4mm; sterile and pH neutral.', usage: 'Mix 30–40% into cocopeat or soil. Improves drainage and prevents root rot.',
    rating: 4.8, reviewCount: 214, isIgoOwn: true, problemFilter: 'Soil Health',
    tags: ['perlite', 'grow-media', 'drainage', 'aeration'], unit: '10 KG Bag', isOrganic: false, crops: ['All crops']
  },
  {
    id: 'pdf-m-004', name: 'Pumice Stone 8–12mm – 25 KG Bag', displayName: 'Pumice Stone 8–12mm 25KG',
    slug: 'pumice-stone-8-12mm-25kg', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 2500, mrp: 3200, discount: 22, stock: 80,
    images: ['/catalog/nursery-essentials/Cocopeat%20(germinating%20medium).jpg'],
    description: 'Natural volcanic pumice stone — highly porous, lightweight and pH neutral. Excellent drainage additive for succulent mixes, bonsai and raised beds.',
    composition: 'Natural volcanic pumice; pH neutral; 8–12mm size.', usage: 'Mix 20–40% into potting media. Ideal for cacti, succulents and bonsai.',
    rating: 4.7, reviewCount: 89, isIgoOwn: true, problemFilter: 'Soil Health',
    tags: ['pumice', 'volcanic', 'succulent-mix', 'drainage'], unit: '25 KG Bag', isOrganic: false, crops: ['Succulents', 'Bonsai', 'Cacti']
  },
  {
    id: 'pdf-m-005', name: 'Exfoliated Vermiculite 2–4mm – 15 KG Bag', displayName: 'Vermiculite 2–4mm 15KG',
    slug: 'vermiculite-2-4mm-15kg', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 1180, mrp: 1550, discount: 24, stock: 120,
    images: ['/catalog/nursery-essentials/Cocopeat%20(germinating%20medium).jpg'],
    description: 'Horticultural vermiculite — improves moisture and nutrient retention in growing media. Sterile, lightweight and ideal for seed germination and cutting propagation.',
    composition: 'Exfoliated vermiculite; 2–4mm; sterile; pH neutral.', usage: 'Mix with cocopeat for seed germination. Use as top-dressing to retain moisture.',
    rating: 4.7, reviewCount: 133, isIgoOwn: true, problemFilter: 'Soil Health',
    tags: ['vermiculite', 'germination', 'moisture-retention', 'propagation'], unit: '15 KG Bag', isOrganic: false, crops: ['All crops']
  },
  {
    id: 'pdf-m-006', name: 'Peat Moss – 60 KG Bag', displayName: 'Peat Moss 60KG',
    slug: 'peat-moss-60kg', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 2700, mrp: 3500, discount: 23, stock: 50,
    images: ['/catalog/nursery-essentials/cocopeat.png'],
    description: 'Premium sphagnum peat moss — acidic substrate ideal for blueberries, azaleas and acid-loving plants. Excellent moisture retention and slow decomposition.',
    composition: 'Natural sphagnum peat; pH 3.5–4.5; low EC.', usage: 'Mix with perlite for acid-loving plants. Ideal for blueberry, azalea, begonia.',
    rating: 4.6, reviewCount: 72, isIgoOwn: false, problemFilter: 'Soil Health',
    tags: ['peat-moss', 'acidic-substrate', 'blueberry', 'moisture-retention'], unit: '60 KG Bag', isOrganic: true, crops: ['Blueberry', 'Azalea', 'Strawberry']
  },
  {
    id: 'pdf-m-007', name: 'Red Lava Rock – 10 KG Bag', displayName: 'Red Lava Rock 10KG',
    slug: 'red-lava-rock-10kg', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 1811, mrp: 2300, discount: 21, stock: 90,
    images: ['/catalog/nursery-essentials/Cocopeat%20(germinating%20medium).jpg'],
    description: 'Porous volcanic lava rock — an excellent long-lasting hydroponic media that supports beneficial microbial colonization. Also used decoratively as mulch.',
    composition: 'Natural volcanic basalt lava rock; porous; pH neutral.', usage: 'Use in Dutch buckets, DWC or as decorative mulch. Rinse before first use.',
    rating: 4.6, reviewCount: 61, isIgoOwn: false, problemFilter: 'Soil Health',
    tags: ['lava-rock', 'volcanic', 'hydroponic-media', 'decorative'], unit: '10 KG Bag', isOrganic: false, crops: ['All crops']
  },
  {
    id: 'pdf-m-008', name: 'Cocopith Disc 40mm (MOQ 100 pcs)', displayName: 'Cocopith Disc 40mm',
    slug: 'cocopith-disc-40mm', brand: 'IGO Agri TechFarms', category: 'Grow Media & Substrates',
    subcategory: 'Grow Media & Substrates', price: 250, mrp: 350, discount: 29, stock: 500,
    images: ['/catalog/nursery-essentials/cocopeat.png'],
    description: 'Compressed cocopeat disc — expands when wet to form a perfect seedling plug. Sterile, pH balanced and biodegradable. Ideal for seed germination and plug transplanting.',
    composition: 'Compressed cocopeat; pH 5.8–6.5; low EC.', usage: 'Place disc in seedling tray, add water and watch it expand. Sow one seed per disc.',
    rating: 4.8, reviewCount: 197, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['cocopith-disc', 'germination', 'seedling-plug', 'biodegradable'], unit: 'Pack of 100', isOrganic: true, crops: ['All crops']
  },

  ...ADDITIONAL_PDF_PRODUCTS,

  // ─── GROW LIGHTS ─────────────────────────────────────────────────────────
  {
    id: 'pdf-l-001', name: 'Full Spectrum LED Grow Light – 4 Feet 18W', displayName: 'Full Spectrum LED 4ft 18W',
    slug: 'full-spectrum-led-4ft-18w', brand: 'IGO Agri TechFarms', category: 'Grow Lights',
    subcategory: 'Grow Lights', price: 600, mrp: 800, discount: 25, stock: 100,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Full spectrum NX4 series LED grow light — 4 feet, 18W. Covers the complete light spectrum for vegetative growth and flowering. Plug-and-play for indoor growing.',
    composition: 'Full spectrum LEDs; 18W; NX4 series; 4 feet length.', usage: 'Hang 12–18 inches above plants. Run 14–16 hrs/day for seedlings; 12 hrs for fruiting.',
    rating: 4.7, reviewCount: 156, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['grow-light', 'full-spectrum', 'led', 'indoor-farming'], unit: '1 Light Fixture', isOrganic: false, crops: ['All indoor crops']
  },
  {
    id: 'pdf-l-002', name: 'Multi Spectrum LED Grow Light – 4 Feet 18W', displayName: 'Multi Spectrum LED 4ft 18W',
    slug: 'multi-spectrum-led-4ft-18w', brand: 'IGO Agri TechFarms', category: 'Grow Lights',
    subcategory: 'Grow Lights', price: 950, mrp: 1250, discount: 24, stock: 75,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Multi-spectrum NX1.5 LED grow light — 4 feet, 18W. Specifically tuned red:blue ratio for enhanced photosynthesis, flowering and fruiting. Higher yield vs full spectrum.',
    composition: 'Multi-spectrum LED (NX1.5 series); 18W; 4 feet; red-blue optimized.', usage: 'Hang 10–15 inches above canopy. Run 12 hrs/day during flowering stage.',
    rating: 4.8, reviewCount: 89, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['grow-light', 'multi-spectrum', 'led', 'flowering'], unit: '1 Light Fixture', isOrganic: false, crops: ['Tomato', 'Chilli', 'Herbs']
  },
  {
    id: 'pdf-l-003', name: 'Green Wall Grow Light – 30W', displayName: 'Green Wall LED Grow Light 30W',
    slug: 'green-wall-grow-light-30w', brand: 'IGO Agri TechFarms', category: 'Grow Lights',
    subcategory: 'Grow Lights', price: 2891, mrp: 3800, discount: 24, stock: 40,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Dedicated 30W LED panel grow light designed for vertical green walls and plant walls. Wide coverage, low heat emission, IP44 moisture resistant.',
    composition: 'Full spectrum LED panel; 30W; IP44 rated; wide beam angle.', usage: 'Mount 20–30cm from green wall panel. Run 12–14 hrs/day.',
    rating: 4.7, reviewCount: 47, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['grow-light', 'green-wall', 'panel-light', 'vertical-garden'], unit: '1 Panel', isOrganic: false, crops: ['Indoor plants', 'Leafy greens']
  },
  {
    id: 'pdf-l-004', name: 'Full Spectrum Round LED – 100W (GHGL-R)', displayName: 'Full Spectrum Round LED 100W',
    slug: 'full-spectrum-round-led-100w', brand: 'IGO Agri TechFarms', category: 'Grow Lights',
    subcategory: 'Grow Lights', price: 8500, mrp: 11000, discount: 23, stock: 25,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'GHGL-R high-power 100W full spectrum round LED grow light — commercial grade for 1m² coverage. For serious indoor growers, microgreen farms and professional setups.',
    composition: 'GHGL-R series; 100W; full spectrum NX4B; passive cooling; 50,000hr lifespan.', usage: 'Hang 30–50cm above canopy. Run 14 hrs/day for leafy greens; 12 hrs for fruiting.',
    rating: 4.9, reviewCount: 31, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['grow-light', 'high-power', '100w', 'commercial'], unit: '1 Fixture', isOrganic: false, crops: ['All indoor crops']
  },
  {
    id: 'pdf-l-005', name: 'Full Spectrum LED Grow Light – 2 Feet 9W', displayName: 'Full Spectrum LED 2ft 9W',
    slug: 'full-spectrum-led-2ft-9w', brand: 'IGO Agri TechFarms', category: 'Grow Lights',
    subcategory: 'Grow Lights', price: 510, mrp: 680, discount: 25, stock: 120,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Compact 2-foot, 9W full spectrum LED grow light for small setups, seedling stations and microgreen systems. Energy-efficient and long-lasting.',
    composition: 'Full spectrum NX4 LEDs; 9W; 2 feet; plug-and-play.', usage: 'Perfect for microgreen trays, seedling stations and small herb kits.',
    rating: 4.6, reviewCount: 108, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['grow-light', 'compact', '2-feet', 'microgreens'], unit: '1 Light Fixture', isOrganic: false, crops: ['Microgreens', 'Seedlings', 'Herbs']
  },

  // ─── INSTRUMENTS (pH, EC, TDS meters) ──────────────────────────────────────
  {
    id: 'pdf-i-001', name: 'Hanna pH Meter HI98107 (Digital)', displayName: 'Hanna pH Meter HI98107',
    slug: 'hanna-ph-meter-hi98107', brand: 'Hanna Instruments', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 5500, mrp: 7000, discount: 21, stock: 30,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Hanna HI98107 digital pH meter — precise ±0.1 pH accuracy; auto-calibration; waterproof. Essential tool for hydroponic nutrient solution management.',
    composition: 'Digital pH sensor; ±0.1 pH accuracy; auto-calibration; ATC.', usage: 'Dip probe in nutrient solution. Calibrate with pH 7.0 buffer solution weekly.',
    rating: 4.8, reviewCount: 64, isIgoOwn: false, problemFilter: 'Irrigation',
    tags: ['ph-meter', 'hanna', 'hydroponic', 'digital-meter'], unit: '1 Piece', isOrganic: false, crops: ['Hydroponic crops']
  },
  {
    id: 'pdf-i-002', name: 'Hanna EC Meter HI98318 (Digital)', displayName: 'Hanna EC Meter HI98318',
    slug: 'hanna-ec-meter-hi98318', brand: 'Hanna Instruments', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 8200, mrp: 10500, discount: 22, stock: 20,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Hanna HI98318 digital EC meter — measures electrical conductivity for precise nutrient concentration monitoring in hydroponic systems. Range: 0–99.9 mS/cm.',
    composition: 'Digital EC sensor; 0–99.9 mS/cm; auto temperature compensation; IP67.', usage: 'Dip probe in nutrient solution. Target EC varies by crop stage.',
    rating: 4.9, reviewCount: 38, isIgoOwn: false, problemFilter: 'Irrigation',
    tags: ['ec-meter', 'hanna', 'hydroponic', 'nutrient-management'], unit: '1 Piece', isOrganic: false, crops: ['Hydroponic crops']
  },
  {
    id: 'pdf-i-003', name: 'HM Digital EC Meter Com-80', displayName: 'HM Digital EC Meter Com-80',
    slug: 'hm-digital-ec-meter-com80', brand: 'HM Digital', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 2750, mrp: 3500, discount: 21, stock: 45,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'HM Digital Com-80 EC/TDS/temperature meter — affordable and accurate for daily hydroponic monitoring. Great starter instrument for home growers.',
    composition: 'Dual EC/TDS meter; temperature compensation; easy calibration.', usage: 'Check nutrient solution EC daily. Adjust concentration based on crop and growth stage.',
    rating: 4.6, reviewCount: 82, isIgoOwn: false, problemFilter: 'Irrigation',
    tags: ['ec-meter', 'tds-meter', 'hm-digital', 'affordable'], unit: '1 Piece', isOrganic: false, crops: ['Hydroponic crops']
  },
  {
    id: 'pdf-i-004', name: 'Mini Digital Tap Timer (Auto Irrigation)', displayName: 'Digital Tap Timer',
    slug: 'mini-digital-tap-timer', brand: 'IGO Agri TechFarms', category: 'Hydroponic Systems',
    subcategory: 'Hydroponic Systems', price: 2625, mrp: 3400, discount: 23, stock: 55,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Digital programmable tap timer for automated drip and hydroponic irrigation. Set up to 8 watering cycles per day. Battery-operated; no power outlet needed near the tap.',
    composition: 'Digital programmable controller; 8 programmes/day; 2×AA battery.', usage: 'Connect between tap and drip hose. Programme watering schedules based on crop needs.',
    rating: 4.7, reviewCount: 97, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['irrigation-timer', 'auto-watering', 'digital', 'drip-system'], unit: '1 Piece', isOrganic: false, crops: ['All crops']
  },

  // ─── HYDROPONIC NUTRIENTS ─────────────────────────────────────────────────
  {
    id: 'pdf-n-001', name: 'NPK 20-20-20 Water Soluble Fertilizer – 1 KG', displayName: 'NPK 20-20-20 Soluble – 1KG',
    slug: 'npk-20-20-20-soluble-1kg', brand: 'IGO Fertigation', category: 'Fertilizers',
    subcategory: 'Fertilizers', price: 289, mrp: 380, discount: 24, stock: 400,
    images: ['/catalog/crop-care/liquid/Liquid%20NPK%2020-20-20.png'],
    description: 'Balanced water-soluble NPK 20-20-20 fertilizer — equal ratio of nitrogen, phosphorus and potassium. Ideal for general vegetative growth in hydroponics and fertigation systems.',
    composition: 'N:P:K = 20:20:20; fully water soluble; micronutrient fortified.', usage: 'Dissolve 2–3g per litre of water. Use weekly for hydroponic nutrient solution top-up.',
    rating: 4.7, reviewCount: 213, isIgoOwn: true, problemFilter: 'Nutrient Deficiency',
    tags: ['npk', 'water-soluble', 'hydroponic-nutrients', 'fertigation'], unit: '1 KG Pack', isOrganic: false, crops: ['All crops']
  },
  {
    id: 'pdf-n-002', name: 'NPK 8-15-36 Potassium-Rich Soluble – 1 KG', displayName: 'NPK 8-15-36 Soluble 1KG',
    slug: 'npk-8-15-36-soluble-1kg', brand: 'IGO Fertigation', category: 'Fertilizers',
    subcategory: 'Fertilizers', price: 475, mrp: 620, discount: 23, stock: 250,
    images: ['/catalog/crop-care/liquid/Liquid%20NPK%2020-20-20.png'],
    description: 'High-potassium NPK 8-15-36 formulation — promotes fruit size, colour and sweetness during ripening. Essential for fruiting crops in hydroponic and greenhouse systems.',
    composition: 'N:P:K = 8:15:36; water soluble; zero chloride; pH balanced.', usage: 'Switch to this formula at flowering/fruiting stage. Dose: 1.5–2g/L of water.',
    rating: 4.8, reviewCount: 147, isIgoOwn: true, problemFilter: 'Nutrient Deficiency',
    tags: ['npk', 'high-potassium', 'fruiting', 'hydroponic'], unit: '1 KG Pack', isOrganic: false, crops: ['Tomato', 'Chilli', 'Strawberry']
  },
  {
    id: 'pdf-n-003', name: 'Calcium Nitrate – 1 KG', displayName: 'Calcium Nitrate 1KG',
    slug: 'calcium-nitrate-1kg', brand: 'IGO Fertigation', category: 'Fertilizers',
    subcategory: 'Fertilizers', price: 210, mrp: 280, discount: 25, stock: 350,
    images: ['/catalog/crop-care/Chemical%20Fertilizers/Ammonium%20Nitrate.webp'],
    description: 'Water-soluble calcium nitrate — prevents blossom end rot in tomatoes and tip burn in lettuce. Provides both calcium and nitrate nitrogen in a plant-available form.',
    composition: 'Calcium Nitrate Ca(NO₃)₂; Ca 15.5%; N 14.4%; water soluble.', usage: 'Dissolve 1g/L in irrigation water. Apply weekly throughout growing season.',
    rating: 4.7, reviewCount: 186, isIgoOwn: true, problemFilter: 'Nutrient Deficiency',
    tags: ['calcium-nitrate', 'blossom-end-rot', 'water-soluble', 'hydroponic'], unit: '1 KG Pack', isOrganic: false, crops: ['Tomato', 'Lettuce', 'Capsicum']
  },
  {
    id: 'pdf-n-004', name: 'Magnesium Sulphate (Epsom Salt) – 1 KG', displayName: 'Magnesium Sulphate 1KG',
    slug: 'magnesium-sulphate-1kg', brand: 'IGO Fertigation', category: 'Fertilizers',
    subcategory: 'Fertilizers', price: 100, mrp: 140, discount: 29, stock: 600,
    images: ['/catalog/crop-care/Chemical%20Fertilizers/Ammonium%20Nitrate.webp'],
    description: 'Pure magnesium sulphate (Epsom Salt) — corrects magnesium deficiency that causes yellowing between leaf veins. Essential secondary nutrient for chlorophyll production.',
    composition: 'MgSO₄·7H₂O; Mg 9.9%; S 13%; fully water soluble.', usage: 'Dissolve 0.5–1g/L in water. Apply as foliar spray or soil drench every 2 weeks.',
    rating: 4.8, reviewCount: 302, isIgoOwn: true, problemFilter: 'Nutrient Deficiency',
    tags: ['magnesium', 'epsom-salt', 'micronutrient', 'chlorophyll'], unit: '1 KG Pack', isOrganic: false, crops: ['All crops']
  },
  {
    id: 'pdf-n-005', name: 'Green Leafy GL-L Hydroponic Nutrient – 500ml', displayName: 'Green Leafy GL-L 500ml',
    slug: 'green-leafy-gl-l-500ml', brand: 'IGO Fertigation', category: 'Fertilizers',
    subcategory: 'Hydroponic Systems', price: 1652, mrp: 2100, discount: 21, stock: 80,
    images: ['/catalog/crop-care/liquid/Liquid%20NPK%2020-20-20.png'],
    description: 'IGO proprietary Green Leafy GL-L liquid nutrient concentrate — specially formulated for lettuce, spinach, kale and leafy greens in NFT and DWC hydroponic systems.',
    composition: 'Balanced NPK + micronutrient liquid; optimized for leafy greens; pH buffered.', usage: 'Dilute 5–7ml/L of water. Maintain EC 1.2–1.8 mS/cm for leafy crops.',
    rating: 4.8, reviewCount: 53, isIgoOwn: true, problemFilter: 'Nutrient Deficiency',
    tags: ['hydroponic-nutrients', 'leafy-greens', 'liquid-nutrient', 'nft'], unit: '500ml Bottle', isOrganic: false, crops: ['Lettuce', 'Spinach', 'Kale']
  },

  // ─── PUMPS & IRRIGATION ───────────────────────────────────────────────────
  {
    id: 'pdf-ir-001', name: 'Submersible Water Pump – 1000 LPH', displayName: 'Submersible Pump 1000 LPH',
    slug: 'submersible-pump-1000lph', brand: 'IGO Farm Automation', category: 'Irrigation Systems',
    subcategory: 'Irrigation Systems', price: 700, mrp: 950, discount: 26, stock: 120,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Compact submersible pump (1000 LPH) for small hydroponic systems, grow towers and drip irrigation. Quiet operation; low power consumption.',
    composition: 'JQP series; 1000 LPH; low power; submersible; IP68.', usage: 'Place in nutrient reservoir. Connect to drip manifold or tower inlet. Run on timer.',
    rating: 4.6, reviewCount: 138, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['submersible-pump', 'hydroponic', 'drip-irrigation', 'low-power'], unit: '1 Piece', isOrganic: false, crops: ['All crops']
  },
  {
    id: 'pdf-ir-002', name: 'Submersible Water Pump – 2500 LPH', displayName: 'Submersible Pump 2500 LPH',
    slug: 'submersible-pump-2500lph', brand: 'IGO Farm Automation', category: 'Irrigation Systems',
    subcategory: 'Irrigation Systems', price: 1200, mrp: 1600, discount: 25, stock: 80,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Medium-duty submersible pump (2500 LPH) for larger hydroponic systems, Dutch bucket arrays and NFT flat beds. Suitable for 30–60 planter setups.',
    composition: 'JQP series; 2500 LPH; 30W; submersible; IP68 rated.', usage: 'For systems with 20–60 planters. Run with a digital timer for timed feeding cycles.',
    rating: 4.7, reviewCount: 94, isIgoOwn: true, problemFilter: 'Irrigation',
    tags: ['submersible-pump', 'medium-duty', 'nft', 'dutch-bucket'], unit: '1 Piece', isOrganic: false, crops: ['All crops']
  },

  // ─── SEEDS ────────────────────────────────────────────────────────────────
  {
    id: 'pdf-s-001', name: 'Tomato Hybrid Seeds (Thakkali) – 5g Pack', displayName: 'Tomato Hybrid Seeds 5g',
    slug: 'tomato-hybrid-seeds-5g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 59, mrp: 80, discount: 26, stock: 800,
    images: ['/catalog/farmer-factory-vegetables/TomatoBangalore.jfif'],
    description: 'Premium F1 hybrid tomato seeds (Thakkali) — high germination rate, disease-resistant, prolific bearer. Germination: 6–10 days. Suitable for grow bags, containers and terrace farms.',
    composition: 'F1 hybrid Solanum lycopersicum; germination rate >85%; seed count ~200/5g.', usage: 'Sow in cocopith disc, cover lightly. Keep moist. Transplant after 21–28 days.',
    rating: 4.8, reviewCount: 345, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['tomato-seeds', 'hybrid-seeds', 'vegetable-seeds', 'thakkali'], unit: '5g Pack', isOrganic: false, crops: ['Tomato']
  },
  {
    id: 'pdf-s-002', name: 'Moringa Seeds (Murungai) – 10 Seeds Pack', displayName: 'Moringa Seeds 10 Pack',
    slug: 'moringa-seeds-10-pack', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 49, mrp: 70, discount: 30, stock: 600,
    images: ['/catalog/crop-care/Field%20Seeds/Groundnut.webp'],
    description: 'Hybrid Moringa (Murungai) seeds — fast-germinating, high-yield drumstick tree ideal for terrace and backyard gardens. Germination: 7–12 days.',
    composition: 'Moringa oleifera hybrid; germination rate >80%.', usage: 'Sow directly in 15-inch pot or ground. Water daily. First harvest in 6–8 months.',
    rating: 4.7, reviewCount: 289, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['moringa-seeds', 'drumstick', 'murungai', 'superfood'], unit: '10 Seeds', isOrganic: false, crops: ['Moringa']
  },
  {
    id: 'pdf-s-003', name: 'Okra Seeds (Vendakkai) – 10g Pack', displayName: 'Okra Seeds 10g',
    slug: 'okra-seeds-10g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 35, mrp: 50, discount: 30, stock: 700,
    images: ['/catalog/crop-care/Vegetables/Ladiesfinger.webp'],
    description: 'High-yield okra (Lady\'s Finger / Vendakkai) seeds — suited for Chennai climate. Fast germination in 5–10 days. Prolific bearer; ready to harvest in 50–60 days.',
    composition: 'Abelmoschus esculentus; open-pollinated; germination rate >85%.', usage: 'Sow directly in grow bags or ground. 2–3 seeds per spot; thin to 1 plant.',
    rating: 4.7, reviewCount: 312, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['okra-seeds', 'vendakkai', 'ladysfinger', 'vegetable-seeds'], unit: '10g Pack', isOrganic: false, crops: ['Okra']
  },
  {
    id: 'pdf-s-004', name: 'Bitter Gourd Seeds (Pavakkai) – 5g Pack', displayName: 'Bitter Gourd Seeds 5g',
    slug: 'bitter-gourd-seeds-5g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 45, mrp: 65, discount: 31, stock: 550,
    images: ['/catalog/crop-care/Vegetables/Bitter%20Guard.webp'],
    description: 'Disease-resistant bitter gourd (Pavakkai) seeds with excellent shelf life. Germination in 7–12 days. Suitable for terrace trellis growing.',
    composition: 'Momordica charantia; hybrid seeds; germination rate >82%.', usage: 'Soak seeds overnight before sowing. Provide trellis support for climbing vines.',
    rating: 4.6, reviewCount: 187, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['bitter-gourd-seeds', 'pavakkai', 'trellis', 'vegetable-seeds'], unit: '5g Pack', isOrganic: false, crops: ['Bitter Gourd']
  },
  {
    id: 'pdf-s-005', name: 'Coriander Seeds (Kothamalli) – 50g Pack', displayName: 'Coriander Seeds 50g',
    slug: 'coriander-seeds-50g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 29, mrp: 40, discount: 28, stock: 900,
    images: ['/catalog/crop-care/Field%20Seeds/Maize%20Corn.webp'],
    description: 'Fresh coriander (Kothamalli) seeds for continuous kitchen garden harvest. Germination in 10–15 days. Perfect for windowsill growing and microgreen production.',
    composition: 'Coriandrum sativum; split seeds; germination rate >80%.', usage: 'Crush seeds lightly before sowing. Sow densely in shallow tray or pot. Harvest in 3–4 weeks.',
    rating: 4.6, reviewCount: 428, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['coriander-seeds', 'kothamalli', 'herb-seeds', 'kitchen-garden'], unit: '50g Pack', isOrganic: false, crops: ['Coriander']
  },
  {
    id: 'pdf-s-006', name: 'Fenugreek Seeds (Vendhayam) – 100g Pack', displayName: 'Fenugreek Seeds 100g',
    slug: 'fenugreek-seeds-100g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 25, mrp: 35, discount: 29, stock: 1000,
    images: ['/catalog/crop-care/Field%20Seeds/Maize%20Corn.webp'],
    description: 'Untreated organic fenugreek (Vendhayam / Methi) seeds — fastest germinating kitchen herb; ready in 3–5 days. Excellent for microgreens and leafy greens.',
    composition: 'Trigonella foenum-graecum; untreated; germination >90%.', usage: 'Sow thickly in shallow tray. Water twice daily. Harvest leaves in 15–20 days.',
    rating: 4.8, reviewCount: 512, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['fenugreek-seeds', 'vendhayam', 'methi', 'microgreens'], unit: '100g Pack', isOrganic: true, crops: ['Fenugreek']
  },
  {
    id: 'pdf-s-007', name: 'Cherry Tomato Seeds – 5g Pack', displayName: 'Cherry Tomato Seeds 5g',
    slug: 'cherry-tomato-seeds-5g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 69, mrp: 95, discount: 27, stock: 500,
    images: ['/catalog/farmer-factory-vegetables/TomatoBangalore.jfif'],
    description: 'Premium cherry tomato (Cherry Thakkali) seeds — prolific bearer, sweet flavour, ideal for balcony containers and grow bags. Germination: 6–10 days.',
    composition: 'F1 hybrid Lycopersicon esculentum var. cerasiforme; >85% germination.', usage: 'Germinate in cocopith disc, transplant at 4-leaf stage. Provide support stakes.',
    rating: 4.9, reviewCount: 274, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['cherry-tomato', 'seeds', 'balcony-garden', 'sweet'], unit: '5g Pack', isOrganic: false, crops: ['Cherry Tomato']
  },
  {
    id: 'pdf-s-008', name: 'Basil Seeds (Genovese) – 2g Pack', displayName: 'Basil Seeds Genovese 2g',
    slug: 'basil-seeds-genovese-2g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 39, mrp: 55, discount: 29, stock: 600,
    images: ['/catalog/crop-care/Field%20Seeds/Maize%20Corn.webp'],
    description: 'Italian Genovese basil seeds (Tirunittru Pachilai) — fragrant large-leaf variety, essential for Italian cooking. Germination: 5–10 days. Excellent for kitchen windowsills.',
    composition: 'Ocimum basilicum Genovese; non-GMO; germination >85%.', usage: 'Sow on soil surface; do not cover. Keep warm and moist. Pinch flowers to extend harvest.',
    rating: 4.7, reviewCount: 193, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['basil-seeds', 'genovese', 'herb', 'kitchen-garden'], unit: '2g Pack', isOrganic: false, crops: ['Basil']
  },
  {
    id: 'pdf-s-009', name: 'Spinach Seeds (Arai Keerai) – 25g Pack', displayName: 'Amaranthus Spinach Seeds 25g',
    slug: 'spinach-amaranthus-seeds-25g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 30, mrp: 45, discount: 33, stock: 800,
    images: ['/catalog/crop-care/Field%20Seeds/Maize%20Corn.webp'],
    description: 'Local Amaranthus spinach (Arai Keerai) seeds — fast-growing, heat-tolerant leafy green suited for Chennai conditions. Germination: 3–5 days. Harvest in 25–30 days.',
    composition: 'Amaranthus tricolor; open-pollinated; germination >90%.', usage: 'Broadcast in grow bag or tray. Water daily. First harvest in 25–30 days.',
    rating: 4.7, reviewCount: 367, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['spinach-seeds', 'arai-keerai', 'leafy-greens', 'fast-growing'], unit: '25g Pack', isOrganic: false, crops: ['Amaranthus Spinach']
  },
  {
    id: 'pdf-s-010', name: 'Brinjal Seeds (Kathirikai) – 5g Pack', displayName: 'Brinjal Seeds 5g',
    slug: 'brinjal-seeds-5g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 45, mrp: 65, discount: 31, stock: 650,
    images: ['/catalog/crop-care/Vegetables/Brinjal.webp'],
    description: 'Hybrid brinjal (Kathirikai / Eggplant) seeds — both round and long varieties available. High yield, suitable for grow bags and containers. Germination: 7–14 days.',
    composition: 'Solanum melongena F1 hybrid; germination rate >82%.', usage: 'Sow in cocopith disc, transplant at 4-6 leaf stage into 12-inch pot or grow bag.',
    rating: 4.6, reviewCount: 221, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['brinjal-seeds', 'kathirikai', 'eggplant', 'vegetable-seeds'], unit: '5g Pack', isOrganic: false, crops: ['Brinjal']
  },
  {
    id: 'pdf-s-011', name: 'Bell Pepper / Capsicum Seeds (Kudai Milagai) – 2g Pack', displayName: 'Capsicum Seeds 2g',
    slug: 'capsicum-seeds-2g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 79, mrp: 110, discount: 28, stock: 450,
    images: ['/catalog/farmer-factory-vegetables/CapsicumGreen.jfif'],
    description: 'Coloured bell pepper (Kudai Milagai / Capsicum) seeds — red, yellow and green varieties. Slow but rewarding crop for terrace gardens.',
    composition: 'Capsicum annuum F1; germination rate >78%; 10–15 day germination.', usage: 'Germinate in cocopith disc; transplant at 4-leaf stage; provide cage support.',
    rating: 4.7, reviewCount: 148, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['capsicum-seeds', 'bell-pepper', 'kudai-milagai', 'vegetable'], unit: '2g Pack', isOrganic: false, crops: ['Capsicum']
  },
  {
    id: 'pdf-s-012', name: 'Lettuce Seeds – 2g Pack', displayName: 'Lettuce Seeds 2g',
    slug: 'lettuce-seeds-2g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 49, mrp: 70, discount: 30, stock: 500,
    images: ['/catalog/crop-care/Field%20Seeds/Maize%20Corn.webp'],
    description: 'Mixed lettuce seeds — fast germination in 4–7 days. Perfect for hydroponic NFT and DWC systems. Harvest in 30–45 days from transplanting.',
    composition: 'Lactuca sativa mixed varieties; germination rate >88%.', usage: 'Sow in oasis cube or cocopith disc. Transplant to hydroponic system at 7-day seedling stage.',
    rating: 4.8, reviewCount: 198, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['lettuce-seeds', 'hydroponic', 'salad-greens', 'fast-harvest'], unit: '2g Pack', isOrganic: false, crops: ['Lettuce']
  },
  {
    id: 'pdf-s-013', name: 'Mint Seeds (Pudina) – 1g Pack', displayName: 'Mint Seeds Pudina 1g',
    slug: 'mint-seeds-pudina-1g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 35, mrp: 50, discount: 30, stock: 600,
    images: ['/catalog/crop-care/Field%20Seeds/Maize%20Corn.webp'],
    description: 'Spearmint (Pudina) seeds for kitchen windowsill and balcony herb gardens. Germination: 7–14 days. Perennial herb that grows back after each harvest.',
    composition: 'Mentha spicata; non-GMO; germination rate >75%.', usage: 'Surface sow; keep consistently moist. Harvest by pinching top growth. Grows in partial shade.',
    rating: 4.6, reviewCount: 284, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['mint-seeds', 'pudina', 'herb-seeds', 'kitchen-herb'], unit: '1g Pack', isOrganic: false, crops: ['Mint']
  },

  // ─── BIO INPUTS & ORGANIC ──────────────────────────────────────────────────
  {
    id: 'pdf-b-001', name: 'Seaweed Extract Liquid – 500ml', displayName: 'Seaweed Extract 500ml',
    slug: 'seaweed-extract-liquid-500ml', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Organic & Bio Inputs', price: 299, mrp: 420, discount: 29, stock: 300,
    images: ['/catalog/organic-bio-inputs/organic-farming.webp'],
    description: 'Concentrated seaweed (Ascophyllum nodosum) liquid extract — natural plant growth hormones (auxins, cytokinins, gibberellins). Improves stress tolerance, rooting, flowering and fruit set.',
    composition: 'Concentrated seaweed extract; auxins; cytokinins; gibberellins; trace minerals.', usage: 'Dilute 5–10ml/L of water. Foliar spray or soil drench every 15 days.',
    rating: 4.8, reviewCount: 267, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['seaweed-extract', 'bio-stimulant', 'growth-hormone', 'organic'], unit: '500ml Bottle', isOrganic: true, crops: ['All crops']
  },
  {
    id: 'pdf-b-002', name: 'Humic & Fulvic Acid – 12% Liquid 500ml', displayName: 'Humic Fulvic Acid 500ml',
    slug: 'humic-fulvic-acid-500ml', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Soil Health', price: 249, mrp: 350, discount: 29, stock: 250,
    images: ['/catalog/crop-care/liquid/Humic%20Acid.png'],
    description: 'Concentrated humic and fulvic acid liquid (12% concentration) — improves soil structure, chelates micronutrients and enhances nutrient uptake by up to 40%.',
    composition: 'Humic acid 8%; fulvic acid 4%; potassium humate; concentrated liquid.', usage: 'Mix 3–5ml/L water. Apply as soil drench or through fertigation. Use monthly.',
    rating: 4.8, reviewCount: 193, isIgoOwn: true, problemFilter: 'Soil Health',
    tags: ['humic-acid', 'fulvic-acid', 'soil-conditioner', 'chelator'], unit: '500ml Bottle', isOrganic: true, crops: ['All crops']
  },
  {
    id: 'pdf-b-003', name: 'Neem Oil Concentrate – 300 PPM – 500ml', displayName: 'Neem Oil 300 PPM 500ml',
    slug: 'neem-oil-300ppm-500ml', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Crop Protection', price: 199, mrp: 280, discount: 29, stock: 450,
    images: ['/catalog/organic-bio-inputs/neem-leaves.webp'],
    description: 'Cold-pressed neem oil (300 PPM Azadirachtin) — broad-spectrum organic pest repellent and insect growth regulator. Controls mealybugs, aphids, whiteflies and leaf miners.',
    composition: 'Cold-pressed neem oil; Azadirachtin 300 PPM; EC formulation.', usage: 'Mix 5ml + 2ml soap/L water. Spray on leaves (top and undersides) in evening.',
    rating: 4.7, reviewCount: 389, isIgoOwn: true, problemFilter: 'Pest Control',
    tags: ['neem-oil', 'bio-pesticide', 'organic', 'azadirachtin'], unit: '500ml Bottle', isOrganic: true, crops: ['All crops']
  },
  {
    id: 'pdf-b-004', name: 'Beauveria Bassiana Bio-Insecticide – 500g', displayName: 'Beauveria Bassiana 500g',
    slug: 'beauveria-bassiana-500g', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Crop Protection', price: 349, mrp: 480, discount: 27, stock: 200,
    images: ['/catalog/organic-bio-inputs/bio-fertilizer.webp'],
    description: 'Beauveria bassiana entomopathogenic fungus — biological insecticide effective against mealybugs, aphids and whiteflies. OMRI-listed organic input.',
    composition: 'Beauveria bassiana CFU ≥2×10⁸/g; wettable powder formulation.', usage: 'Mix 5g/L water. Spray on infested plants in evening. Repeat after 7–10 days.',
    rating: 4.7, reviewCount: 124, isIgoOwn: true, problemFilter: 'Pest Control',
    tags: ['beauveria', 'bio-insecticide', 'organic', 'mealybug-control'], unit: '500g Pack', isOrganic: true, crops: ['All crops']
  },
  {
    id: 'pdf-b-005', name: 'Trichoderma Viride Bio-Fungicide – 500g', displayName: 'Trichoderma Viride 500g',
    slug: 'trichoderma-viride-500g', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Crop Protection', price: 279, mrp: 390, discount: 28, stock: 280,
    images: ['/catalog/organic-bio-inputs/bio-fertilizer.webp'],
    description: 'Trichoderma viride talc-based bio-fungicide — prevents and controls root rot, wilt and damping-off. Colonizes the root zone and outcompetes fungal pathogens.',
    composition: 'Trichoderma viride CFU ≥2×10⁶/g; talc-based powder.', usage: 'Mix 10g/kg seed or soil drench at 5g/L water. Apply at transplanting and 30 DAT.',
    rating: 4.8, reviewCount: 167, isIgoOwn: true, problemFilter: 'Disease Control',
    tags: ['trichoderma', 'bio-fungicide', 'organic', 'root-rot'], unit: '500g Pack', isOrganic: true, crops: ['Tomato', 'Chilli', 'Vegetables']
  },
  {
    id: 'pdf-b-006', name: 'Neem Cake Powder – 1 KG', displayName: 'Neem Cake Powder 1KG',
    slug: 'neem-cake-powder-1kg', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Fertilizers', price: 79, mrp: 110, discount: 28, stock: 600,
    images: ['/catalog/organic-bio-inputs/neem-leaves.webp'],
    description: 'Neem cake powder — residue after neem oil extraction. Rich in azadirachtin, improves soil health, repels soil pests and nematodes. Natural organic fertilizer and pest deterrent.',
    composition: 'Neem cake (Azadirachta indica); N 5.2%, P 0.9%, K 1.4%; azadirachtin content.', usage: 'Mix 50–100g per 10L of potting mix. Or top-dress and water in monthly.',
    rating: 4.7, reviewCount: 312, isIgoOwn: true, problemFilter: 'Soil Health',
    tags: ['neem-cake', 'organic-fertilizer', 'soil-pest', 'nematode'], unit: '1 KG Pack', isOrganic: true, crops: ['All crops']
  },
  {
    id: 'pdf-b-007', name: 'Panchagavya Organic Bio-Booster – 1L', displayName: 'Panchagavya 1 Litre',
    slug: 'panchagavya-1litre', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Organic & Bio Inputs', price: 149, mrp: 210, discount: 29, stock: 350,
    images: ['/catalog/organic-bio-inputs/compost.webp'],
    description: 'Traditional Panchagavya cow-based bio-booster — fermented cow products enriched with beneficial microbes. Promotes plant immunity, flowering and overall vigour.',
    composition: 'Fermented cow urine, dung, milk, curd and ghee; beneficial microflora.', usage: 'Dilute 30ml/L water. Foliar spray every 10–15 days or soil drench monthly.',
    rating: 4.6, reviewCount: 178, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['panchagavya', 'bio-booster', 'organic', 'cow-based'], unit: '1 Litre Can', isOrganic: true, crops: ['All crops']
  },
  {
    id: 'pdf-b-008', name: 'Bone Meal – 1 KG', displayName: 'Bone Meal 1KG',
    slug: 'bone-meal-1kg', brand: 'IGO Bio Solutions', category: 'Organic & Bio Inputs',
    subcategory: 'Fertilizers', price: 119, mrp: 165, discount: 28, stock: 400,
    images: ['/catalog/organic-bio-inputs/organic-farming.webp'],
    description: 'Steam-sterilized bone meal powder — slow-release phosphorus and calcium source. Promotes strong root development and flowering. Essential for bulb crops and fruiting plants.',
    composition: 'Sterilized bone meal; P 18%, N 4%; slow-release formula.', usage: 'Mix 10–15g per litre of potting mix. Apply at planting time for best results.',
    rating: 4.7, reviewCount: 203, isIgoOwn: false, problemFilter: 'Nutrient Deficiency',
    tags: ['bone-meal', 'phosphorus', 'organic', 'slow-release'], unit: '1 KG Pack', isOrganic: true, crops: ['All crops']
  },

  // ─── LIVE PLANTS (from Live Inventory) ────────────────────────────────────
  {
    id: 'pdf-pl-001', name: 'Aloe Vera Plant – 6 Inch Pot', displayName: 'Aloe Vera Plant',
    slug: 'aloe-vera-plant-6inch', brand: 'IGO Agri TechFarms', category: 'Indoor Plants',
    subcategory: 'Outdoor Plants & Trees', price: 149, mrp: 199, discount: 25, stock: 5,
    images: ['/catalog/nursery-indoor/Aloe.webp'],
    description: 'Healthy Aloe Vera plant in 6-inch terracotta pot — drought-tolerant, air-purifying and medicinal. Fresh leaves can be used topically for skin and hair. Ready to display.',
    composition: 'Aloe barbadensis miller; well-rooted live plant in pot.', usage: 'Water once a week; bright indirect light. Excellent indoor and balcony plant.',
    rating: 4.9, reviewCount: 389, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['aloe-vera', 'medicinal-plant', 'indoor', 'drought-tolerant'], unit: '1 Plant (6" pot)', isOrganic: true, crops: []
  },
  {
    id: 'pdf-pl-002', name: 'Dragon Fruit Cactus Plant – 6 Inch Pot', displayName: 'Dragon Fruit Plant',
    slug: 'dragon-fruit-plant-6inch', brand: 'IGO Agri TechFarms', category: 'Outdoor Plants & Trees',
    subcategory: 'Outdoor Plants & Trees', price: 349, mrp: 499, discount: 30, stock: 5,
    images: ['/catalog/farmer-factory-fruits/droganfruit.jfif'],
    description: 'Healthy dragon fruit (Pitaya) cactus plant — ready to pot-on and grow into a productive climber. Fruits within 1–2 years. Suitable for terrace pots and backyard trellises.',
    composition: 'Hylocereus undatus; vegetatively propagated; well-rooted cutting.', usage: 'Plant in 12–18 inch pot with well-draining soil. Provide trellis support. Full sun.',
    rating: 4.8, reviewCount: 124, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['dragon-fruit', 'exotic-fruit', 'cactus', 'terrace-garden'], unit: '1 Plant (6" pot)', isOrganic: true, crops: []
  },
  {
    id: 'pdf-pl-003', name: 'Blueberry Plant – 6 Inch Pot', displayName: 'Blueberry Plant',
    slug: 'blueberry-plant-6inch', brand: 'IGO Agri TechFarms', category: 'Outdoor Plants & Trees',
    subcategory: 'Outdoor Plants & Trees', price: 599, mrp: 799, discount: 25, stock: 6,
    images: ['/catalog/nursery-outdoor/Bougainvillea.webp'],
    description: 'Southern highbush blueberry plant — adapted for Chennai\'s warm climate. Rich in antioxidants. Grows in acidic cocopeat mix. Limited stock — currently 6 plants in good condition.',
    composition: 'Vaccinium corymbosum southern highbush variety; live plant in pot.', usage: 'Use acidic mix (peat + perlite). Maintain pH 4.5–5.5. Partial to full sun. Water regularly.',
    rating: 4.9, reviewCount: 47, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['blueberry', 'berry-plant', 'antioxidant', 'premium-fruit'], unit: '1 Plant (6" pot)', isOrganic: true, crops: []
  },
  {
    id: 'pdf-pl-004', name: 'Jasmine Plant (Mullai) – 5 Inch Pot', displayName: 'Jasmine Plant',
    slug: 'jasmine-plant-5inch', brand: 'IGO Agri TechFarms', category: 'Outdoor Plants & Trees',
    subcategory: 'Outdoor Plants & Trees', price: 99, mrp: 149, discount: 34, stock: 8,
    images: ['/catalog/crop-care/Flowers/JAsmine.webp'],
    description: 'Fragrant Arabian jasmine (Mullai) plant — prolific bloomer; traditional favourite for home gardens, pooja and garlands. Currently 8 plants in good condition in stock.',
    composition: 'Jasminum sambac; grafted or rooted cutting; live pot plant.', usage: 'Full to partial sun. Water daily. Pinch tips to encourage branching and more blooms.',
    rating: 4.8, reviewCount: 231, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['jasmine', 'mullai', 'flowering-plant', 'fragrant'], unit: '1 Plant (5" pot)', isOrganic: true, crops: []
  },
  {
    id: 'pdf-pl-005', name: 'Mulberry Plant – 6 Inch Pot', displayName: 'Mulberry Plant',
    slug: 'mulberry-plant-6inch', brand: 'IGO Agri TechFarms', category: 'Outdoor Plants & Trees',
    subcategory: 'Outdoor Plants & Trees', price: 249, mrp: 349, discount: 29, stock: 5,
    images: ['/catalog/nursery-outdoor/Plumeria.webp'],
    description: 'Healthy mulberry (Morus) plant — fast-growing fruit tree excellent for terrace containers. Sweet-tart berries ripen within a year. Also acts as a shade plant.',
    composition: 'Morus alba or Morus rubra; rooted cutting; live pot plant.', usage: 'Plant in 12-inch pot or ground. Water regularly; full sun. Prune to maintain size.',
    rating: 4.7, reviewCount: 68, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['mulberry', 'fruit-plant', 'fast-growing', 'terrace-tree'], unit: '1 Plant (6" pot)', isOrganic: true, crops: []
  },

  // ─── GARDEN DECOR ─────────────────────────────────────────────────────────
  {
    id: 'pdf-d-001', name: 'Solar Stake Garden Lights – Set of 6', displayName: 'Solar Stake Lights (Set of 6)',
    slug: 'solar-stake-lights-set6', brand: 'IGO Agri TechFarms', category: 'Garden Decor',
    subcategory: 'Garden Decor', price: 599, mrp: 850, discount: 29, stock: 200,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'Stainless steel solar LED stake lights — IP65 waterproof, auto on/off at dusk/dawn. Transforms garden pathways and terrace edges with warm amber glow. No wiring required.',
    composition: 'Stainless steel body; solar panel; LED; rechargeable NiMH battery; IP65.', usage: 'Push stake into soil or pot. Place in sunlit spot. Fully charges in 6–8 hrs sunlight.',
    rating: 4.6, reviewCount: 178, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['solar-lights', 'garden-light', 'pathway', 'waterproof'], unit: 'Set of 6', isOrganic: false, crops: []
  },
  {
    id: 'pdf-d-002', name: 'Bamboo Wind Chimes – 5-Tube', displayName: 'Bamboo Wind Chimes',
    slug: 'bamboo-wind-chimes-5tube', brand: 'IGO Agri TechFarms', category: 'Garden Decor',
    subcategory: 'Garden Decor', price: 249, mrp: 350, discount: 29, stock: 150,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'Hand-crafted natural bamboo wind chimes — warm earthy tones, eco-friendly. Perfect for balconies, patios and garden entrances. Promotes a zen garden atmosphere.',
    composition: 'Treated natural bamboo tubes; cotton cord.', usage: 'Hang in a breezy spot — balcony overhang or garden entrance. Treat with oil annually.',
    rating: 4.5, reviewCount: 134, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['wind-chimes', 'bamboo', 'decor', 'zen-garden'], unit: '1 Piece', isOrganic: false, crops: []
  },
  {
    id: 'pdf-d-003', name: 'Zen/Buddha Garden Statue – Polyresin', displayName: 'Buddha Garden Statue',
    slug: 'zen-buddha-statue-polyresin', brand: 'IGO Agri TechFarms', category: 'Garden Decor',
    subcategory: 'Garden Decor', price: 499, mrp: 700, discount: 29, stock: 80,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'Weather-resistant polyresin Buddha / Zen garden statue — sandstone finish, UV-coated for outdoor use. Adds tranquility and aesthetic appeal to garden spaces.',
    composition: 'Polyresin; UV-resistant finish; weather-proof coating.', usage: 'Place in garden, balcony corner or near water feature. Clean with damp cloth.',
    rating: 4.7, reviewCount: 98, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['buddha-statue', 'garden-decor', 'zen', 'polyresin'], unit: '1 Piece', isOrganic: false, crops: []
  },
  {
    id: 'pdf-d-004', name: 'Garden Water Fountain – LED Polyresin (Plug & Play)', displayName: 'Garden Water Fountain LED',
    slug: 'garden-water-fountain-led', brand: 'IGO Agri TechFarms', category: 'Garden Decor',
    subcategory: 'Garden Decor', price: 1499, mrp: 2100, discount: 29, stock: 50,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'Decorative polyresin garden water fountain with built-in LED lighting and submersible pump — plug-and-play, no plumbing required. Creates a relaxing garden focal point.',
    composition: 'Polyresin; LED; submersible recirculating pump; 220V plug-in.', usage: 'Fill basin with water; plug in. Top up water weekly. Clean pump filter monthly.',
    rating: 4.6, reviewCount: 61, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['water-fountain', 'garden-decor', 'led', 'relaxation'], unit: '1 Piece', isOrganic: false, crops: []
  },
  {
    id: 'pdf-d-005', name: 'White Marble Pebbles – 10mm – 1 KG', displayName: 'White Marble Pebbles 1KG',
    slug: 'white-marble-pebbles-10mm-1kg', brand: 'IGO Agri TechFarms', category: 'Garden Decor',
    subcategory: 'Garden Decor', price: 89, mrp: 120, discount: 26, stock: 500,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'Pure snow-white marble pebbles (10mm) — tumbled smooth finish for pot top-dressing, aquarium decorating and landscape design. Adds a premium clean look to terrace gardens.',
    composition: 'Natural white marble; tumbled; 10mm size.', usage: 'Use as pot top dressing (2–3cm layer) to retain moisture and prevent weeds.',
    rating: 4.7, reviewCount: 203, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['marble-pebbles', 'white-pebbles', 'top-dressing', 'aquarium'], unit: '1 KG Bag', isOrganic: false, crops: []
  },
  {
    id: 'pdf-d-006', name: 'Lava Rock Pebbles (Decorative) – 10mm – 1 KG', displayName: 'Lava Rock Pebbles 1KG',
    slug: 'lava-rock-pebbles-10mm-1kg', brand: 'IGO Agri TechFarms', category: 'Garden Decor',
    subcategory: 'Garden Decor', price: 99, mrp: 140, discount: 29, stock: 350,
    images: ['/catalog/nursery-essentials/Pots.png'],
    description: 'Red-black volcanic lava rock pebbles — porous, lightweight and adds dramatic contrast to garden displays. Used for pot top-dressing, aquascaping and landscape art.',
    composition: 'Natural volcanic lava rock; 10mm; porous; red/black.', usage: 'Use as pot top-dressing or in aquarium. Rinse before use.',
    rating: 4.6, reviewCount: 117, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['lava-rock', 'decorative-pebbles', 'volcanic', 'aquascape'], unit: '1 KG Bag', isOrganic: false, crops: []
  },

  // ─── TURF & GRASS ─────────────────────────────────────────────────────────
  {
    id: 'pdf-t-001', name: 'Mexican Carpet Grass – Sod (1×1 ft)', displayName: 'Mexican Carpet Grass Sod',
    slug: 'mexican-carpet-grass-sod', brand: 'IGO Agri TechFarms', category: 'Turf & Grass',
    subcategory: 'Turf & Grass', price: 45, mrp: 65, discount: 31, stock: 500,
    images: ['/catalog/nursery-outdoor/LILYTURF.webp'],
    description: 'Mexican Carpet Grass sod (1×1 ft) — dense velvet texture, bright green. Premium choice for barefoot luxury lawns and terrace turf. Low maintenance once established.',
    composition: 'Stenotaphrum secundatum (Mexican Carpet); live grass sod.', usage: 'Prepare firm level base; lay sods tightly; water daily for 2 weeks until established.',
    rating: 4.8, reviewCount: 87, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['carpet-grass', 'lawn-grass', 'sod', 'luxury-lawn'], unit: '1 sq ft Sod', isOrganic: false, crops: []
  },
  {
    id: 'pdf-t-002', name: 'Bermuda Grass – Sod (1×1 ft)', displayName: 'Bermuda Grass Sod',
    slug: 'bermuda-grass-sod', brand: 'IGO Agri TechFarms', category: 'Turf & Grass',
    subcategory: 'Turf & Grass', price: 35, mrp: 50, discount: 30, stock: 800,
    images: ['/catalog/nursery-outdoor/LILYTURF.webp'],
    description: 'Bermuda Grass sod (Cynodon dactylon) — fast recovery, aggressive growth, heat and drought tolerant. Best for high-traffic areas, parks and sports grounds.',
    composition: 'Cynodon dactylon; live sod.', usage: 'Lay on prepared level surface. Water twice daily for first 2 weeks. Mow regularly.',
    rating: 4.7, reviewCount: 124, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['bermuda-grass', 'lawn', 'sports-turf', 'drought-tolerant'], unit: '1 sq ft Sod', isOrganic: false, crops: []
  },
  {
    id: 'pdf-t-003', name: 'Artificial Grass – 25mm Pile (Per sq ft)', displayName: 'Artificial Grass 25mm',
    slug: 'artificial-grass-25mm-per-sqft', brand: 'IGO Agri TechFarms', category: 'Turf & Grass',
    subcategory: 'Turf & Grass', price: 65, mrp: 90, discount: 28, stock: 5000,
    images: ['/catalog/nursery-outdoor/LILYTURF.webp'],
    description: 'Triple-tone natural-look artificial grass — 25mm pile height, UV resistant, suitable for terrace and balcony landscaping. Medium traffic. No watering, no mowing.',
    composition: 'UV-resistant PP/PE fibres; triple tone (3 shades of green); drainage backing.', usage: 'Lay on flat surface; trim with scissors; secure edges with clips or adhesive.',
    rating: 4.6, reviewCount: 246, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['artificial-grass', 'fake-grass', 'balcony', 'low-maintenance'], unit: 'Per sq ft', isOrganic: false, crops: []
  },
  {
    id: 'pdf-t-004', name: 'Artificial Grass – 35mm Pile (Per sq ft)', displayName: 'Artificial Grass 35mm Premium',
    slug: 'artificial-grass-35mm-per-sqft', brand: 'IGO Agri TechFarms', category: 'Turf & Grass',
    subcategory: 'Turf & Grass', price: 90, mrp: 125, discount: 28, stock: 4000,
    images: ['/catalog/nursery-outdoor/LILYTURF.webp'],
    description: 'Premium multi-tone lush artificial grass — 35mm pile, soft PE fibres for a natural feel. Ideal for kids\' play areas and premium villas. Drainage holes prevent waterlogging.',
    composition: 'Soft PE/PP mixed fibres; 35mm pile; multi-tone; drainage holes; UV rated.', usage: 'Best laid on a rubber underlay for comfort. Suitable for rooftop cafes and pet zones.',
    rating: 4.8, reviewCount: 178, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['artificial-grass', 'premium', '35mm', 'kids-play'], unit: 'Per sq ft', isOrganic: false, crops: []
  },

  // ─── GREENHOUSE SUPPLIES ──────────────────────────────────────────────────
  {
    id: 'pdf-g-001', name: 'Grow Tent – 2×2×5 Feet (Indoor Grow)', displayName: 'Grow Tent 2×2×5ft',
    slug: 'grow-tent-2x2x5ft', brand: 'IGO Agri TechFarms', category: 'Nursery & Garden Essentials',
    subcategory: 'Hydroponic Systems', price: 9844, mrp: 12500, discount: 21, stock: 25,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: 'Compact 2×2×5ft indoor grow tent — reflective Mylar interior maximizes light efficiency. Ventilation ports, waterproof floor tray. Perfect for microgreen and seedling setups.',
    composition: '600D oxford canvas exterior; 95% reflective Mylar interior; waterproof PE floor tray; steel poles.',
    usage: 'Set up inside home or office. Use with grow light and inline fan. Ideal for microgreens and seedlings.',
    rating: 4.7, reviewCount: 42, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['grow-tent', 'indoor-growing', 'mylar', 'controlled-environment'], unit: '1 Tent', isOrganic: false, crops: ['Microgreens', 'Seedlings']
  },
  {
    id: 'pdf-g-002', name: 'Shade Net 50% – Per Sq Metre', displayName: 'Shade Net 50%',
    slug: 'shade-net-50-per-sqm', brand: 'IGO Agri TechFarms', category: 'Nursery & Garden Essentials',
    subcategory: 'Nursery & Garden Essentials', price: 25, mrp: 35, discount: 29, stock: 10000,
    images: ['/catalog/nursery-essentials/shade-net.jpg'],
    description: '50% green shade net — reduces direct sunlight intensity by half. Ideal for nursery seedlings, terrace gardens and greenhouse side walls. UV stabilized for 5+ year life.',
    composition: 'HDPE tape mesh; 50% shade factor; UV stabilized; green/white colour.',
    usage: 'Install over terrace frame or nursery structure. MOQ 210 sqm for bulk orders.',
    rating: 4.6, reviewCount: 312, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['shade-net', '50-percent', 'uv-stabilized', 'nursery'], unit: 'Per sq m (MOQ 210 sqm)', isOrganic: false, crops: ['All crops']
  },

  // ─── MICROGREEN SEED INVENTORY ─────────────────────────────────────────────
  {
    id: 'pdf-mg-001', name: 'Wheat Grass Microgreen Seeds – 500g', displayName: 'Wheat Grass Seeds 500g',
    slug: 'wheatgrass-microgreen-seeds-500g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 149, mrp: 200, discount: 26, stock: 40,
    images: ['/catalog/crop-care/Field%20Seeds/Wheat%20Seed.webp'],
    description: 'Premium wheat grass seeds for microgreen and wheatgrass juicing production. High germination rate; ready to harvest in 7–10 days. Rich in chlorophyll and enzymes.',
    composition: 'Triticum aestivum; untreated; germination >92%.', usage: 'Pre-soak 8 hrs; sow densely on coir mat. Harvest at 7–10 days with scissors.',
    rating: 4.8, reviewCount: 134, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['wheatgrass', 'microgreens', 'juicing', 'health'], unit: '500g Pack', isOrganic: true, crops: ['Wheat Grass']
  },
  {
    id: 'pdf-mg-002', name: 'Sunflower Microgreen Seeds – 500g', displayName: 'Sunflower Microgreen Seeds 500g',
    slug: 'sunflower-microgreen-seeds-500g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 169, mrp: 230, discount: 27, stock: 45,
    images: ['/catalog/crop-care/Flowers/Sunflower.webp'],
    description: 'Black sunflower seeds for microgreen production — thick crunchy stems, nutty flavour. Among the most popular and nutritious microgreens. Ready in 8–12 days.',
    composition: 'Helianthus annuus; untreated black sunflower seeds; germination >88%.', usage: 'Pre-soak overnight; sow and cover for 2 days; uncover and grow to harvest.',
    rating: 4.8, reviewCount: 98, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['sunflower-microgreens', 'microgreens', 'nutty', 'crunchy'], unit: '500g Pack', isOrganic: true, crops: ['Sunflower Microgreens']
  },
  {
    id: 'pdf-mg-003', name: 'Radish Microgreen Seeds (Purple) – 500g', displayName: 'Purple Radish Microgreens 500g',
    slug: 'radish-purple-microgreen-seeds-500g', brand: 'IGO Seeds', category: 'Seeds & Saplings',
    subcategory: 'Seeds & Saplings', price: 189, mrp: 260, discount: 27, stock: 60,
    images: ['/catalog/farmer-factory-vegetables/Radish.jfif'],
    description: 'Purple daikon radish microgreen seeds — vibrant purple-pink colouring, spicy flavour. High in anthocyanins and Vitamin C. Restaurant-grade garnish microgreen. Ready in 6–8 days.',
    composition: 'Raphanus sativus var. Daikon Purple; untreated; germination >90%.', usage: 'Sow densely, cover 24 hrs. Uncover and grow. Harvest when cotyledons open fully.',
    rating: 4.9, reviewCount: 76, isIgoOwn: true, problemFilter: 'Plant Care',
    tags: ['radish-microgreens', 'purple-radish', 'garnish', 'restaurant'], unit: '500g Pack', isOrganic: true, crops: ['Radish Microgreens']
  },

  // ─── SOIL HEALTH PRODUCTS ──────────────────────────────────────────────────
  {
    id: 'pdf-sh-001', name: 'IGO Soil Testing Kit – NPK + pH (Digital)', displayName: 'Soil Testing Kit Digital',
    slug: 'igo-soil-testing-kit-npk-ph-digital', brand: 'IGO AgriMart', category: 'Soil Health',
    subcategory: 'Soil Health', price: 1299, mrp: 1799, discount: 28, stock: 120,
    images: ['/catalog/soil-health/soil-testing.webp'],
    description: 'Digital NPK + pH soil testing kit for accurate on-farm analysis. Results in under 5 minutes. Supports better fertilizer decisions and reduces input waste.',
    composition: 'Digital pH meter + NPK test strips; calibration solution included.', usage: 'Collect soil sample, dissolve in provided solution, dip strip or meter and read values.',
    rating: 4.7, reviewCount: 89, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['soil-test', 'npk', 'ph-meter', 'digital'], unit: '1 Kit', isOrganic: false, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-002', name: 'Humic Acid Granules – 1 kg', displayName: 'Humic Acid Granules 1kg',
    slug: 'humic-acid-granules-1kg', brand: 'IGO Organics', category: 'Soil Health',
    subcategory: 'Soil Health', price: 349, mrp: 499, discount: 30, stock: 250,
    images: ['/catalog/soil-health/soil-nutrients.webp'],
    description: 'High-concentration humic acid granules to improve soil structure, water retention, and nutrient availability. Compatible with all fertilizers.',
    composition: 'Humic acid 85% (min); derived from leonardite.', usage: 'Apply 2–5 kg/acre as basal dose; mix into soil before sowing.',
    rating: 4.6, reviewCount: 134, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['humic-acid', 'soil-amendment', 'organic', 'leonardite'], unit: '1 kg Bag', isOrganic: true, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-003', name: 'Gypsum Powder – 5 kg', displayName: 'Gypsum Powder 5kg',
    slug: 'gypsum-powder-5kg', brand: 'IGO AgriMart', category: 'Soil Health',
    subcategory: 'Soil Health', price: 199, mrp: 280, discount: 29, stock: 300,
    images: ['/catalog/soil-health/healthy-soil.webp'],
    description: 'Agricultural gypsum for calcium and sulphur supplementation. Improves sodic soils and reduces soil compaction. Ideal for groundnut and cotton.',
    composition: 'Calcium sulphate (CaSO4·2H2O) 90% min.', usage: 'Broadcast 100–200 kg/acre; incorporate into topsoil before planting.',
    rating: 4.4, reviewCount: 67, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['gypsum', 'calcium', 'sulphur', 'soil-amendment'], unit: '5 kg Bag', isOrganic: false, crops: ['Groundnut', 'Cotton', 'All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-004', name: 'Dolomite Lime – 5 kg', displayName: 'Dolomite Lime 5kg',
    slug: 'dolomite-lime-5kg', brand: 'IGO AgriMart', category: 'Soil Health',
    subcategory: 'Soil Health', price: 179, mrp: 250, discount: 28, stock: 200,
    images: ['/catalog/soil-health/soil-sample.webp'],
    description: 'Dolomite lime for soil pH correction and magnesium supplementation. Neutralises acidic soils and improves nutrient uptake.',
    composition: 'CaCO3 + MgCO3; neutralising value 95%; fine powder.', usage: 'Apply 100–500 kg/acre based on soil pH; mix into soil 2–3 weeks before planting.',
    rating: 4.5, reviewCount: 52, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['dolomite', 'lime', 'ph-correction', 'magnesium'], unit: '5 kg Bag', isOrganic: false, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-005', name: 'Premium Vermicompost – 5 kg', displayName: 'Vermicompost 5kg',
    slug: 'premium-vermicompost-5kg', brand: 'IGO Organics', category: 'Soil Health',
    subcategory: 'Soil Health', price: 299, mrp: 399, discount: 25, stock: 400,
    images: ['/catalog/soil-health/healthy-soil.webp'],
    description: 'Rich worm-cast vermicompost for improved soil biology and fertility. Boosts microbial activity and provides balanced macro and micro nutrients.',
    composition: 'Worm castings from Eisenia fetida; NPK 2-1-1 approx; pH 6.5–7.5.', usage: 'Mix 1–2 kg per pot or apply 2–3 tonnes/acre as basal dose.',
    rating: 4.8, reviewCount: 210, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['vermicompost', 'worm-castings', 'organic', 'soil-biology'], unit: '5 kg Bag', isOrganic: true, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-006', name: 'Mycorrhizal VAM Inoculant – 500g', displayName: 'Mycorrhizal VAM 500g',
    slug: 'mycorrhizal-vam-inoculant-500g', brand: 'IGO Bio Solutions', category: 'Soil Health',
    subcategory: 'Soil Health', price: 449, mrp: 649, discount: 31, stock: 150,
    images: ['/catalog/soil-health/soil-nutrients.webp'],
    description: 'Vesicular Arbuscular Mycorrhizal (VAM) fungi inoculant to enhance root nutrient and water uptake. Reduces phosphorus fertilizer needs by 30–40%.',
    composition: 'Glomus spp. 200 IP/g (min); talc-based carrier.', usage: 'Apply 250g/acre as seed treatment or soil drench at transplanting.',
    rating: 4.7, reviewCount: 78, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['mycorrhiza', 'vam', 'bioinoculant', 'root-health'], unit: '500g Pack', isOrganic: true, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-007', name: 'Bio-Compost with Trichoderma – 5 kg', displayName: 'Trichoderma Bio-Compost 5kg',
    slug: 'bio-compost-trichoderma-5kg', brand: 'IGO Bio Solutions', category: 'Soil Health',
    subcategory: 'Soil Health', price: 359, mrp: 499, discount: 28, stock: 180,
    images: ['/catalog/soil-health/healthy-soil.webp'],
    description: 'Enriched compost fortified with Trichoderma viride for dual benefit of organic nutrition and biological disease suppression in soil.',
    composition: 'Composted biomass + Trichoderma viride 2×10^6 CFU/g.', usage: 'Apply 250–500 kg/acre as basal dose or 500g/sq m for pots and raised beds.',
    rating: 4.6, reviewCount: 91, isIgoOwn: true, problemFilter: 'Disease Control',
    tags: ['trichoderma', 'bio-compost', 'disease-suppression', 'organic'], unit: '5 kg Bag', isOrganic: true, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-008', name: 'Fulvic Acid Liquid – 500 ml', displayName: 'Fulvic Acid 500ml',
    slug: 'fulvic-acid-liquid-500ml', brand: 'IGO Organics', category: 'Soil Health',
    subcategory: 'Soil Health', price: 499, mrp: 699, discount: 29, stock: 140,
    images: ['/catalog/soil-health/soil-testing.webp'],
    description: 'Concentrated fulvic acid liquid for improved micronutrient chelation and plant bioavailability. Enhances chlorophyll production and stress tolerance.',
    composition: 'Fulvic acid 12% w/v; pH 3–4; liquid formulation.', usage: 'Dilute 2–3 ml/litre and apply as foliar spray or drip fertigation.',
    rating: 4.8, reviewCount: 63, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['fulvic-acid', 'chelation', 'micronutrient', 'foliar'], unit: '500 ml Bottle', isOrganic: true, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-009', name: 'Zeolite Soil Conditioner – 5 kg', displayName: 'Zeolite 5kg',
    slug: 'zeolite-soil-conditioner-5kg', brand: 'IGO AgriMart', category: 'Soil Health',
    subcategory: 'Soil Health', price: 429, mrp: 599, discount: 28, stock: 110,
    images: ['/catalog/soil-health/soil-sample.webp'],
    description: 'Natural zeolite mineral for improved soil CEC, moisture retention, and slow-release of ammonium. Reduces leaching and fertilizer runoff.',
    composition: 'Clinoptilolite zeolite 85% min; particle size 1–3 mm.', usage: 'Incorporate 100–200 kg/acre before planting; top-dress at 50 kg/acre mid-season.',
    rating: 4.5, reviewCount: 44, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['zeolite', 'cec', 'moisture-retention', 'slow-release'], unit: '5 kg Bag', isOrganic: false, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
  {
    id: 'pdf-sh-010', name: 'Bentonite Clay – 5 kg', displayName: 'Bentonite Clay 5kg',
    slug: 'bentonite-clay-5kg', brand: 'IGO AgriMart', category: 'Soil Health',
    subcategory: 'Soil Health', price: 249, mrp: 349, discount: 29, stock: 160,
    images: ['/catalog/soil-health/soil-nutrients.webp'],
    description: 'Sodium bentonite clay for improving sandy and loamy soil water-holding capacity. Reduces irrigation frequency and nutrient leaching.',
    composition: 'Montmorillonite clay 80% min; swelling index 15 ml/2g.', usage: 'Mix 250–500 kg/acre into the plough layer; water immediately after application.',
    rating: 4.4, reviewCount: 38, isIgoOwn: true, problemFilter: 'Growth Boosters',
    tags: ['bentonite', 'clay', 'water-retention', 'sandy-soil'], unit: '5 kg Bag', isOrganic: false, crops: ['All crops'],
    certifications: [{ name: 'IGO Quality Checked', issuer: 'IGO AgriMart', isVerified: true }]
  },
];
