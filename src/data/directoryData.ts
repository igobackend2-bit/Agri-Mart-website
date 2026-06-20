import { Tractor, TrendingUp, ShoppingBag, Leaf, Shield, Heart } from 'lucide-react';

export const directoryData = [
  {
    id: 'div-1',
    name: '01 Agritech & Production',
    icon: Tractor,
    description: 'Core agricultural operations, farm management, plant propagation, and organic produce cultivation driving our primary agricultural output.',
    brands: [
      { id: 'b-1', name: 'IGO Agritech Farms' },
      { id: 'b-2', name: 'Farmers Factory' },
      { id: 'b-3', name: 'IGO Nursery' },
      { id: 'b-5', name: 'IGO Farm Factories' }
    ]
  },
  {
    id: 'div-2',
    name: '02 Trade & Distribution',
    icon: TrendingUp,
    description: 'Seamless supply chain solutions, wholesale distribution, and retail networks connecting farms directly to markets and businesses.',
    brands: [
      { id: 'b-6', name: 'IGO Agri Mart' },
      { id: 'b-7', name: 'IGO Mart' },
      { id: 'b-8', name: 'IGO Exports & Imports' },
      { id: 'b-9', name: 'IGO Farmgate Mandi' },
      { id: 'b-10', name: 'IGO Franchise' }
    ]
  },
  {
    id: 'div-3',
    name: '03 Food & Lifestyle',
    icon: ShoppingBag,
    description: 'Premium consumer-facing brands delivering farm-to-table foods, organic cosmetics, and sustainable lifestyle products.',
    brands: [
      { id: 'b-11', name: 'Protein Cuts' },
      { id: 'b-12', name: 'Palm Cafe' },
      { id: 'b-13', name: 'IGO Organic Pharmacy' },
      { id: 'b-14', name: 'IGO Natural Cosmetics' },
      { id: 'b-15', name: 'India Green Organics' },
      { id: 'b-16', name: 'India Green' }
    ]
  },
  {
    id: 'div-4',
    name: '04 Finance & Real Estate',
    icon: Shield,
    description: 'Financial empowerment for farmers through micro-finance, strategic farm land investments, and wealth management services.',
    brands: [
      { id: 'b-17', name: 'IGO Fintech' },
      { id: 'b-18', name: 'IGO Farm Land Estates' },
      { id: 'b-19', name: 'IGO Wealth Management' },
      { id: 'b-20', name: 'IGO Farm Loans' }
    ]
  },
  {
    id: 'div-5',
    name: '05 Tech & Infrastructure',
    icon: Leaf,
    description: 'Advanced agricultural engineering, renewable energy integration, and smart automation to modernize farming practices.',
    brands: [
      { id: 'b-21', name: 'IGO Crop Care' },
      { id: 'b-22', name: 'IGO Farm Automation' },
      { id: 'b-23', name: 'IGO Green Energy' },
      { id: 'b-24', name: 'IGO Tech Foundation' }
    ]
  },
  {
    id: 'div-6',
    name: '06 Education & Impact',
    icon: Heart,
    description: 'Empowering the community through specialized agricultural training and philanthropic initiatives for rural development.',
    brands: [
      { id: 'b-25', name: 'IGO Training Courses' },
      { id: 'b-26', name: 'IGO Foundation' }
    ]
  }
];
