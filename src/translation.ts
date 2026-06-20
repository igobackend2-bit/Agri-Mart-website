export interface LanguageDict {
  logoText: string;
  tagline: string;
  announcement: string;
  searchPlaceholder: string;
  login: string;
  logout: string;
  myAccount: string;
  allProducts: string;
  categories: string;
  cart: string;
  wishlist: string;
  freeShippingAlert: string;
  home: string;
  bestSellers: string;
  shopByCategory: string;
  ownBrandsTitle: string;
  partnerBrands: string;
  whatsappOrder: string;
  whatsappMessage: string;
  addToCart: string;
  addedToCart: string;
  buyNow: string;
  mrp: string;
  reviews: string;
  rating: string;
  stock: string;
  inStock: string;
  outOfStock: string;
  pincodeCheck: string;
  pincodePlaceholder: string;
  check: string;
  pincodeDeliveryAvailable: string;
  pincodeNotServiced: string;
  cropSolutionsTitle: string;
  farmLoansTitle: string;
  subsidyTitle: string;
  subsidyAmount: string;
  applyNow: string;
  footerAddress: string;
  phone: string;
  email: string;
}

export const translations: Record<string, LanguageDict> = {
  en: {
    logoText: 'IGO AGRI MARKET',
    tagline: "India's Complete Agritech Marketplace — 27 Brands, One Platform",
    announcement: 'Free shipping above ₹1,300 | PAN India COD | 27 Brands',
    searchPlaceholder: 'Search seeds, fertilizers, implements, brands...',
    login: 'Login / Sign In',
    logout: 'Logout',
    myAccount: 'My Dashboard',
    allProducts: 'All Products',
    categories: 'Categories',
    cart: 'Cart',
    wishlist: 'Wishlist',
    freeShippingAlert: 'Add items worth ₹{amount} more for FREE shipping!',
    home: 'Home',
    bestSellers: 'Best Selling Products',
    shopByCategory: 'Shop by Category',
    ownBrandsTitle: 'IGO Group 27 Conglomerate Brands',
    partnerBrands: 'Third-Party Brand Partners',
    whatsappOrder: 'Order via WhatsApp',
    whatsappMessage: 'Hello, I want to order:',
    addToCart: 'Add to Cart',
    addedToCart: 'Added!',
    buyNow: 'Buy Now',
    mrp: 'MRP',
    reviews: 'Reviews',
    rating: 'Rating',
    stock: 'Stock Available',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    pincodeCheck: 'Check Delivery Pincode',
    pincodePlaceholder: 'Enter 6-digit Pincode',
    check: 'Check',
    pincodeDeliveryAvailable: '✓ Express delivery is available for this pincode!',
    pincodeNotServiced: '✗ Sorry, we do not ship to this pincode yet.',
    cropSolutionsTitle: 'Crop Solution Kits (Bundled Combos)',
    farmLoansTitle: 'Govt Subsidy & Farm Loans Scheme',
    subsidyTitle: 'Government Capital Subsidy Finder',
    subsidyAmount: 'Subsidy Amount',
    applyNow: 'Check Scheme Details',
    footerAddress: 'No. 17 Kovalan Street, Uthandi, Kanathur, Chennai 600119',
    phone: '7397785803',
    email: 'br.admin@igogroups.com'
  },
  ta: {
    logoText: 'ஐஜிஓ அக்ரி மார்க்கெட்',
    tagline: 'இந்தியாவின் முழுமையான அக்ரிடெக் சந்தை — 27 பிராண்டுகள், ஒரே தளம்',
    announcement: '₹1,300க்கு மேல் இலவச ஷிப்பிங் | பான் இந்தியா சிஓடி | 27 பிராண்டுகள்',
    searchPlaceholder: 'விதைகள், உரங்கள், கருவிகள், பிராண்டுகளைத் தேடுங்கள்...',
    login: 'உள்நுழைய',
    logout: 'வெளியேறு',
    myAccount: 'எனது கணக்கு',
    allProducts: 'அனைத்து தயாரிப்புகள்',
    categories: 'வகைகள்',
    cart: 'கூடை',
    wishlist: 'விருப்பப்பட்டியல்',
    freeShippingAlert: 'இலவச ஷிப்பிங்கிற்கு இன்னும் ₹{amount} மதிப்புள்ள பொருட்களைச் சேர்க்கவும்!',
    home: 'முகப்பு',
    bestSellers: 'அதிகம் விற்பனையாகும் தயாரிப்புகள்',
    shopByCategory: 'வகைகள் வாரியாக கடை',
    ownBrandsTitle: 'ஐஜிஓ குழுமத்தின் 27 கூட்டமைப்பு பிராண்டுகள்',
    partnerBrands: 'மூன்றாம் தரப்பு பிராண்ட் கூட்டாளர்கள்',
    whatsappOrder: 'வாட்ஸ்அப் மூலம் ஆர்டர் செய்யுங்கள்',
    whatsappMessage: 'வணக்கம், நான் ஆர்டர் செய்ய விரும்புகிறேன்:',
    addToCart: 'கூடையில் சேர்',
    addedToCart: 'சேர்க்கப்பட்டது!',
    buyNow: 'இப்போதே வாங்கு',
    mrp: 'அசல் விலை (MRP)',
    reviews: 'மதிப்புரைகள்',
    rating: 'மதிப்பீடு',
    stock: 'இருப்பு கைவசம்',
    inStock: 'தயாராக உள்ளது',
    outOfStock: 'கையிருப்பில் இல்லை',
    pincodeCheck: 'டெலிவரி பின்கோடைச் சரிபார்க்கவும்',
    pincodePlaceholder: '6 இலக்க பின்கோடை உள்ளிடவும்',
    check: 'சரிபார்',
    pincodeDeliveryAvailable: '✓ இந்த பின்கோடிற்கு எக்ஸ்பிரஸ் டெலிவரி கிடைக்கிறது!',
    pincodeNotServiced: '✗ மன்னிக்கவும், இந்த பின்கோடிற்கு இன்னும் சேவை வழங்கப்படவில்லை.',
    cropSolutionsTitle: 'பயிர் தீர்வு தொகுப்புகள் (காம்போஸ்)',
    farmLoansTitle: 'அரசு மானியம் & விவசாயக் கடன் திட்டம்',
    subsidyTitle: 'அரசு மூலதன மானியக் கண்டறிவி',
    subsidyAmount: 'மானியத் தொகை',
    applyNow: 'திட்ட விவரங்களைச் சரிபார்க்கவும்',
    footerAddress: 'எண். 17 கோவலன் தெரு, உத்தண்டி, கனாத்தூர், சென்னை 600119',
    phone: '7397785803',
    email: 'br.admin@igogroups.com'
  },
  hi: {
    logoText: 'आईजीओ एग्री मार्केट',
    tagline: 'भारत का संपूर्ण एग्रीटेक मार्केटप्लेस — 27 ब्रांड, एक मंच',
    announcement: '₹1,300 से ऊपर मुफ्त शिपिंग | पैन इंडिया COD | 27 ब्रांड',
    searchPlaceholder: 'बीज, खाद, उपकरण, ब्रांड खोजें...',
    login: 'लॉगिन / साइन इन',
    logout: 'लॉगआउट',
    myAccount: 'मेरा डैशबोर्ड',
    allProducts: 'सभी उत्पाद',
    categories: 'श्रेणियाँ',
    cart: 'कार्ट',
    wishlist: 'इच्छा-सूची',
    freeShippingAlert: 'मुफ्त शिपिंग के लिए ₹{amount} और मूल्य के उत्पाद जोड़ें!',
    home: 'होम',
    bestSellers: 'सर्वाधिक बिकने वाले उत्पाद',
    shopByCategory: 'श्रेणी अनुसार खरीदें',
    ownBrandsTitle: 'आईजीओ ग्रुप के 27 ब्रांड',
    partnerBrands: 'तृतीय-पक्ष ब्रांड भागीदार',
    whatsappOrder: 'व्हाट्सएप से ऑर्डर करें',
    whatsappMessage: 'नमस्ते, मैं ऑर्डर करना चाहता हूँ:',
    addToCart: 'कार्ट में डालें',
    addedToCart: 'जोड़ा गया!',
    buyNow: 'अभी खरीदें',
    mrp: 'एमआरपी',
    reviews: 'समीक्षाएँ',
    rating: 'रेटिंग',
    stock: 'स्टॉक उपलब्ध',
    inStock: 'स्टॉक में',
    outOfStock: 'स्टॉक खत्म',
    pincodeCheck: 'डिलीवरी पिनकोड जांचें',
    pincodePlaceholder: '6 अंकों का पिनकोड दर्ज करें',
    check: 'जांचें',
    pincodeDeliveryAvailable: '✓ इस पिनकोड के लिए एक्सप्रेस डिलीवरी उपलब्ध है!',
    pincodeNotServiced: '✗ क्षमा करें, हम अभी इस पिनकोड पर डिलीवरी नहीं करते।',
    cropSolutionsTitle: 'फसल समाधान किट (कॉम्बो)',
    farmLoansTitle: 'सरकारी सब्सिडी और कृषि ऋण योजना',
    subsidyTitle: 'सरकारी पूंजी सब्सिडी खोजक',
    subsidyAmount: 'सब्सिडी राशि',
    applyNow: 'योजना विवरण देखें',
    footerAddress: 'No. 17 Kovalan Street, Uthandi, Kanathur, Chennai 600119',
    phone: '7397785803',
    email: 'br.admin@igogroups.com'
  },
  te: {
    logoText: 'ఐజీఓ అగ్రి మార్కెట్',
    tagline: 'భారతదేశపు సంపూర్ణ అగ్రిటెక్ మార్కెట్‌ప్లేస్ — 27 బ్రాండ్‌లు, ఒకే వేదిక',
    announcement: '₹1,300 పైన ఉచిత షిప్పింగ్ | పాన్ ఇండియా COD | 27 బ్రాండ్‌లు',
    searchPlaceholder: 'విత్తనాలు, ఎరువులు, పనిముట్లు, బ్రాండ్‌లను శోధించండి...',
    login: 'లాగిన్ / సైన్ ఇన్',
    logout: 'లాగౌట్',
    myAccount: 'నా డాష్‌బోర్డ్',
    allProducts: 'అన్ని ఉత్పత్తులు',
    categories: 'వర్గాలు',
    cart: 'కార్ట్',
    wishlist: 'కోరికల జాబితా',
    freeShippingAlert: 'ఉచిత షిప్పింగ్ కోసం మరో ₹{amount} విలువైన వస్తువులను జోడించండి!',
    home: 'హోమ్',
    bestSellers: 'అత్యధికంగా అమ్ముడవుతున్న ఉత్పత్తులు',
    shopByCategory: 'వర్గం వారీగా షాపింగ్',
    ownBrandsTitle: 'ఐజీఓ గ్రూప్ 27 బ్రాండ్‌లు',
    partnerBrands: 'థర్డ్-పార్టీ బ్రాండ్ భాగస్వాములు',
    whatsappOrder: 'వాట్సాప్ ద్వారా ఆర్డర్ చేయండి',
    whatsappMessage: 'నమస్తే, నేను ఆర్డర్ చేయాలనుకుంటున్నాను:',
    addToCart: 'కార్ట్‌కు జోడించు',
    addedToCart: 'జోడించబడింది!',
    buyNow: 'ఇప్పుడే కొనండి',
    mrp: 'ఎమ్మార్పీ',
    reviews: 'సమీక్షలు',
    rating: 'రేటింగ్',
    stock: 'స్టాక్ అందుబాటులో',
    inStock: 'స్టాక్‌లో ఉంది',
    outOfStock: 'స్టాక్ లేదు',
    pincodeCheck: 'డెలివరీ పిన్‌కోడ్ తనిఖీ చేయండి',
    pincodePlaceholder: '6 అంకెల పిన్‌కోడ్ నమోదు చేయండి',
    check: 'తనిఖీ',
    pincodeDeliveryAvailable: '✓ ఈ పిన్‌కోడ్‌కు ఎక్స్‌ప్రెస్ డెలివరీ అందుబాటులో ఉంది!',
    pincodeNotServiced: '✗ క్షమించండి, ఈ పిన్‌కోడ్‌కు ఇంకా సేవ లేదు.',
    cropSolutionsTitle: 'పంట పరిష్కార కిట్‌లు (కాంబోలు)',
    farmLoansTitle: 'ప్రభుత్వ సబ్సిడీ & వ్యవసాయ రుణ పథకం',
    subsidyTitle: 'ప్రభుత్వ మూలధన సబ్సిడీ ఫైండర్',
    subsidyAmount: 'సబ్సిడీ మొత్తం',
    applyNow: 'పథకం వివరాలు చూడండి',
    footerAddress: 'No. 17 Kovalan Street, Uthandi, Kanathur, Chennai 600119',
    phone: '7397785803',
    email: 'br.admin@igogroups.com'
  }
};
