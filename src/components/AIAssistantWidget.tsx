import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Globe,
  MessageCircle
} from 'lucide-react';

interface AIAssistantWidgetProps {
  lang: 'en' | 'ta';
}

type AssistantLang = 'en' | 'ta' | 'hi' | 'te' | 'kn';

interface ChatMessage {
  id: string;
  from: 'user' | 'bot';
  text: string;
}

const LANGUAGES: { code: AssistantLang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const UI_TEXT: Record<AssistantLang, { greeting: string; placeholder: string; title: string; subtitle: string; demoNotice: string; quickPrompts: string[] }> = {
  en: {
    title: 'IGO AI Agriculture Assistant',
    subtitle: 'Ask about crops, products, weather, or schemes — in your language',
    greeting: "Vanakkam! I'm the IGO Agriculture Assistant (demo preview). Ask me about crop care, fertilizer dosage, weather, or government schemes — I'll do my best to help in English, Tamil, Hindi, Telugu, or Kannada.",
    placeholder: 'Type your farming question…',
    demoNotice: 'Demo preview — replies are sample responses. The production assistant will run on an LLM backend and also be available on WhatsApp.',
    quickPrompts: [
      'Best fertilizer for tomato saplings?',
      "What's the weather outlook this week?",
      'How do I treat leaf curl in chillies?',
      'Tell me about PM-KISAN scheme updates'
    ],
  },
  ta: {
    title: 'IGO AI விவசாய உதவியாளர்',
    subtitle: 'பயிர்கள், தயாரிப்புகள், வானிலை அல்லது திட்டங்கள் பற்றி உங்கள் மொழியில் கேளுங்கள்',
    greeting: 'வணக்கம்! நான் IGO விவசாய உதவியாளர் (மாதிரி காட்சி). பயிர் பராமரிப்பு, உர அளவு, வானிலை அல்லது அரசு திட்டங்கள் பற்றி கேளுங்கள் — தமிழ், ஆங்கிலம், இந்தி, தெலுங்கு அல்லது கன்னடத்தில் உதவுவேன்.',
    placeholder: 'உங்கள் விவசாய கேள்வியை தட்டச்சு செய்யவும்…',
    demoNotice: 'மாதிரி காட்சி — பதில்கள் மாதிரி எடுத்துக்காட்டுகள். நேரடி உதவியாளர் AI மாதிரியில் இயங்கும், WhatsApp-இலும் கிடைக்கும்.',
    quickPrompts: [
      'தக்காளி நாற்றுக்கு சிறந்த உரம்?',
      'இந்த வாரம் வானிலை எப்படி இருக்கும்?',
      'மிளகாயில் இலை சுருள் நோய்க்கு சிகிச்சை?',
      'PM-KISAN திட்ட புதுப்பிப்புகள் சொல்லுங்கள்'
    ],
  },
  hi: {
    title: 'IGO AI कृषि सहायक',
    subtitle: 'फसलों, उत्पादों, मौसम या योजनाओं के बारे में अपनी भाषा में पूछें',
    greeting: 'नमस्ते! मैं IGO कृषि सहायक हूँ (डेमो पूर्वावलोकन)। फसल देखभाल, उर्वरक खुराक, मौसम या सरकारी योजनाओं के बारे में पूछें — मैं अंग्रेज़ी, तमिल, हिंदी, तेलुगु या कन्नड़ में मदद करूँगा।',
    placeholder: 'अपना कृषि प्रश्न लिखें…',
    demoNotice: 'डेमो पूर्वावलोकन — उत्तर नमूना प्रतिक्रियाएँ हैं। उत्पादन सहायक एक AI मॉडल पर चलेगा और WhatsApp पर भी उपलब्ध होगा।',
    quickPrompts: [
      'टमाटर की पौध के लिए सबसे अच्छा उर्वरक?',
      'इस सप्ताह मौसम का अनुमान क्या है?',
      'मिर्च में पत्ती मरोड़ का इलाज कैसे करें?',
      'PM-KISAN योजना अपडेट बताएं'
    ],
  },
  te: {
    title: 'IGO AI వ్యవసాయ సహాయకుడు',
    subtitle: 'పంటలు, ఉత్పత్తులు, వాతావరణం లేదా పథకాల గురించి మీ భాషలో అడగండి',
    greeting: 'నమస్కారం! నేను IGO వ్యవసాయ సహాయకుడిని (డెమో ప్రివ్యూ). పంట సంరక్షణ, ఎరువుల మోతాదు, వాతావరణం లేదా ప్రభుత్వ పథకాల గురించి అడగండి — ఆంగ్లం, తమిళం, హిందీ, తెలుగు లేదా కన్నడలో సహాయం చేస్తాను.',
    placeholder: 'మీ వ్యవసాయ ప్రశ్నను టైప్ చేయండి…',
    demoNotice: 'డెమో ప్రివ్యూ — సమాధానాలు నమూనా ప్రతిస్పందనలు. ఉత్పత్తి సహాయకుడు AI మోడల్‌పై నడుస్తుంది మరియు WhatsAppలో కూడా అందుబాటులో ఉంటుంది.',
    quickPrompts: [
      'టమాటా మొక్కలకు ఉత్తమ ఎరువు?',
      'ఈ వారం వాతావరణ సూచన ఏమిటి?',
      'మిరపలో ఆకు ముడత చికిత్స ఎలా?',
      'PM-KISAN పథక అప్‌డేట్‌లు చెప్పండి'
    ],
  },
  kn: {
    title: 'IGO AI ಕೃಷಿ ಸಹಾಯಕ',
    subtitle: 'ಬೆಳೆಗಳು, ಉತ್ಪನ್ನಗಳು, ಹವಾಮಾನ ಅಥವಾ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ',
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು IGO ಕೃಷಿ ಸಹಾಯಕ (ಡೆಮೊ ಪೂರ್ವವೀಕ್ಷಣೆ). ಬೆಳೆ ಆರೈಕೆ, ಗೊಬ್ಬರದ ಪ್ರಮಾಣ, ಹವಾಮಾನ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ — ಇಂಗ್ಲಿಷ್, ತಮಿಳು, ಹಿಂದಿ, ತೆಲುಗು ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
    placeholder: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ…',
    demoNotice: 'ಡೆಮೊ ಪೂರ್ವವೀಕ್ಷಣೆ — ಪ್ರತ್ಯುತ್ತರಗಳು ಮಾದರಿ ಪ್ರತಿಕ್ರಿಯೆಗಳು. ಉತ್ಪಾದನಾ ಸಹಾಯಕವು AI ಮಾದರಿಯಲ್ಲಿ ಚಲಿಸುತ್ತದೆ ಮತ್ತು WhatsApp ನಲ್ಲಿಯೂ ಲಭ್ಯವಿರುತ್ತದೆ.',
    quickPrompts: [
      'ಟೊಮ್ಯಾಟೊ ಸಸಿಗಳಿಗೆ ಉತ್ತಮ ಗೊಬ್ಬರ?',
      'ಈ ವಾರದ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಏನು?',
      'ಮೆಣಸಿನಕಾಯಿಯಲ್ಲಿ ಎಲೆ ಸುರುಳಿ ರೋಗಕ್ಕೆ ಚಿಕಿತ್ಸೆ?',
      'PM-KISAN ಯೋಜನೆ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ತಿಳಿಸಿ'
    ],
  },
};

// Mocked canned responses keyed by rough topic — production version would call an LLM backend
const MOCK_REPLIES: Record<AssistantLang, Record<string, string>> = {
  en: {
    fertilizer: "For tomato saplings, a balanced soluble feed like NPK 19:19:19 at 2-3g per litre works well during the vegetative stage, shifting to a higher-potassium mix once flowering begins. Check the 'Recommended dosage' on each product page for exact rates.",
    weather: "This week's outlook for central Tamil Nadu shows scattered showers mid-week with daytime highs around 32-34°C — a good window for transplanting, but hold off on spraying until after the rain clears.",
    disease: "Leaf curl in chillies is often caused by sap-sucking pests (whiteflies/thrips) spreading a viral infection. Remove affected plants early, use yellow sticky traps, and consider a recommended insecticide — or try our Crop Doctor tool for an image-based diagnosis.",
    scheme: "PM-KISAN instalments are typically disbursed in 4-month cycles. Make sure your e-KYC and land records are updated on the portal — our Knowledge Hub has a guide on resolving common mismatches.",
    default: "That's a great question — in the full version I'd analyse it with an AI model trained on agronomy data for your region. For now, you can also explore our Crop Doctor, Knowledge Hub, or Expert Services for related guidance."
  },
  ta: {
    fertilizer: "தக்காளி நாற்றுகளுக்கு, தாவர வளர்ச்சி கட்டத்தில் NPK 19:19:19ஐ ஒரு லிட்டருக்கு 2-3 கிராம் அளவில் பயன்படுத்தலாம்; பூக்கும் கட்டத்தில் அதிக பொட்டாசியம் கொண்ட உரத்திற்கு மாறவும். துல்லியமான அளவுக்கு ஒவ்வொரு தயாரிப்பு பக்கத்திலும் உள்ள 'பரிந்துரைக்கப்பட்ட அளவை' பாருங்கள்.",
    weather: "இந்த வாரம் மத்திய தமிழ்நாட்டில் நடுவாரத்தில் சிதறிய மழை, பகல் வெப்பநிலை 32-34°C வரை இருக்கும் — நடவு செய்ய நல்ல நேரம், ஆனால் மழை முடிந்த பிறகே தெளிக்கவும்.",
    disease: "மிளகாயில் இலை சுருள் பெரும்பாலும் வெள்ளை ஈ/த்ரிப்ஸ் போன்ற பூச்சிகளால் பரவும் வைரஸ் தொற்றால் ஏற்படுகிறது. பாதிக்கப்பட்ட செடிகளை அகற்றவும், மஞ்சள் ஒட்டும் பொறிகளை பயன்படுத்தவும் — அல்லது எங்கள் கிராப் டாக்டர் கருவியில் புகைப்படம் மூலம் கண்டறியவும்.",
    scheme: "PM-KISAN தவணைகள் பொதுவாக 4 மாத சுழற்சியில் வழங்கப்படும். உங்கள் e-KYC மற்றும் நில பதிவுகள் போர்ட்டலில் புதுப்பிக்கப்பட்டுள்ளதா எனச் சரிபார்க்கவும் — எங்கள் அறிவு மையத்தில் வழிகாட்டி உள்ளது.",
    default: "நல்ல கேள்வி — முழு பதிப்பில் இதை உங்கள் பகுதிக்கான வேளாண் தரவுகளில் பயிற்சி பெற்ற AI மாதிரி மூலம் பகுப்பாய்வு செய்வேன். தற்போது, கிராப் டாக்டர், அறிவு மையம் அல்லது நிபுணர் சேவைகளை பார்வையிடலாம்."
  },
  hi: {
    fertilizer: "टमाटर की पौध के लिए, वानस्पतिक चरण में NPK 19:19:19 को 2-3 ग्राम प्रति लीटर की दर से इस्तेमाल करना अच्छा रहता है; फूल आने पर अधिक पोटैशियम वाले मिश्रण पर स्विच करें। सटीक मात्रा के लिए हर उत्पाद पेज पर 'अनुशंसित खुराक' देखें।",
    weather: "इस सप्ताह मध्य तमिलनाडु में बीच-बीच में बारिश और दिन का तापमान 32-34°C रहने की संभावना है — रोपाई के लिए अच्छा समय है, लेकिन बारिश थमने के बाद ही छिड़काव करें।",
    disease: "मिर्च में पत्ती मरोड़ अक्सर सफेद मक्खी/थ्रिप्स जैसे कीटों से फैलने वाले वायरस संक्रमण के कारण होता है। प्रभावित पौधों को हटाएं, पीले स्टिकी ट्रैप का उपयोग करें — या हमारे क्रॉप डॉक्टर टूल से तस्वीर के आधार पर जांच कराएं।",
    scheme: "PM-KISAN की किस्तें आमतौर पर 4 महीने के चक्र में जारी होती हैं। सुनिश्चित करें कि आपका e-KYC और भूमि रिकॉर्ड पोर्टल पर अपडेट हैं — हमारे नॉलेज हब में इसकी पूरी गाइड उपलब्ध है।",
    default: "बहुत अच्छा सवाल है — पूर्ण संस्करण में मैं इसे आपके क्षेत्र के कृषि डेटा पर प्रशिक्षित AI मॉडल से विश्लेषण करूंगा। फिलहाल आप क्रॉप डॉक्टर, नॉलेज हब या एक्सपर्ट सर्विसेज़ देख सकते हैं।"
  },
  te: {
    fertilizer: "టమాటా మొక్కలకు, వృక్ష దశలో NPK 19:19:19ని లీటరుకు 2-3 గ్రాముల చొప్పున వాడటం మంచిది; పూత దశలో ఎక్కువ పొటాషియం మిశ్రమానికి మారండి. ఖచ్చితమైన మోతాదు కోసం ప్రతి ఉత్పత్తి పేజీలో 'సిఫార్సు చేసిన మోతాదు' చూడండి.",
    weather: "ఈ వారం మధ్య తమిళనాడులో మధ్యవారంలో చెదురుమదురు వర్షాలు, పగటి ఉష్ణోగ్రత 32-34°C వరకు ఉండే అవకాశం — నాట్లు వేయడానికి మంచి సమయం, కానీ వర్షం ఆగిన తర్వాతే పిచికారీ చేయండి.",
    disease: "మిరపలో ఆకు ముడత సాధారణంగా తెల్లదోమ/త్రిప్స్ వంటి పురుగుల ద్వారా వ్యాపించే వైరస్ వల్ల వస్తుంది. ప్రభావిత మొక్కలను తొలగించండి, పసుపు జిగురు ఉచ్చులను వాడండి — లేదా మా క్రాప్ డాక్టర్ సాధనంతో చిత్రం ఆధారంగా నిర్ధారణ పొందండి.",
    scheme: "PM-KISAN వాయిదాలు సాధారణంగా 4 నెలల చక్రంలో అందజేస్తారు. మీ e-KYC మరియు భూమి రికార్డులు పోర్టల్‌లో అప్‌డేట్ అయ్యాయో లేదో చూసుకోండి — మా నాలెడ్జ్ హబ్‌లో పూర్తి గైడ్ ఉంది.",
    default: "మంచి ప్రశ్న — పూర్తి వెర్షన్‌లో దీన్ని మీ ప్రాంత వ్యవసాయ డేటాపై శిక్షణ పొందిన AI మోడల్‌తో విశ్లేషిస్తాను. ప్రస్తుతానికి క్రాప్ డాక్టర్, నాలెడ్జ్ హబ్ లేదా ఎక్స్‌పర్ట్ సర్వీసెస్ చూడవచ్చు."
  },
  kn: {
    fertilizer: "ಟೊಮ್ಯಾಟೊ ಸಸಿಗಳಿಗೆ, ಸಸ್ಯ ಬೆಳವಣಿಗೆ ಹಂತದಲ್ಲಿ NPK 19:19:19 ಅನ್ನು ಪ್ರತಿ ಲೀಟರ್‌ಗೆ 2-3 ಗ್ರಾಂನಷ್ಟು ಬಳಸುವುದು ಉತ್ತಮ; ಹೂಬಿಡುವ ಹಂತದಲ್ಲಿ ಹೆಚ್ಚು ಪೊಟ್ಯಾಸಿಯಮ್ ಮಿಶ್ರಣಕ್ಕೆ ಬದಲಾಯಿಸಿ. ನಿಖರ ಪ್ರಮಾಣಕ್ಕಾಗಿ ಪ್ರತಿ ಉತ್ಪನ್ನ ಪುಟದಲ್ಲಿ 'ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣ' ನೋಡಿ.",
    weather: "ಈ ವಾರ ಮಧ್ಯ ತಮಿಳುನಾಡಿನಲ್ಲಿ ವಾರದ ಮಧ್ಯಭಾಗದಲ್ಲಿ ಸಿಂಪಡಿಸಿದ ಮಳೆ, ಹಗಲಿನ ತಾಪಮಾನ 32-34°C ಇರಬಹುದು — ನಾಟಿ ಮಾಡಲು ಉತ್ತಮ ಸಮಯ, ಆದರೆ ಮಳೆ ನಿಂತ ನಂತರವೇ ಸಿಂಪಡಿಸಿ.",
    disease: "ಮೆಣಸಿನಕಾಯಿಯಲ್ಲಿ ಎಲೆ ಸುರುಳಿ ಸಾಮಾನ್ಯವಾಗಿ ಬಿಳಿ ನೊಣ/ಥ್ರಿಪ್ಸ್‌ನಂತಹ ಕೀಟಗಳಿಂದ ಹರಡುವ ವೈರಸ್ ಸೋಂಕಿನಿಂದ ಉಂಟಾಗುತ್ತದೆ. ಬಾಧಿತ ಸಸ್ಯಗಳನ್ನು ತೆಗೆದುಹಾಕಿ, ಹಳದಿ ಅಂಟು ಬಲೆಗಳನ್ನು ಬಳಸಿ — ಅಥವಾ ನಮ್ಮ ಕ್ರಾಪ್ ಡಾಕ್ಟರ್ ಪರಿಕರದಲ್ಲಿ ಚಿತ್ರ ಆಧಾರಿತ ರೋಗನಿರ್ಣಯ ಪಡೆಯಿರಿ.",
    scheme: "PM-KISAN ಕಂತುಗಳನ್ನು ಸಾಮಾನ್ಯವಾಗಿ 4 ತಿಂಗಳ ಚಕ್ರದಲ್ಲಿ ವಿತರಿಸಲಾಗುತ್ತದೆ. ನಿಮ್ಮ e-KYC ಮತ್ತು ಭೂ ದಾಖಲೆಗಳು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನವೀಕರಿಸಲ್ಪಟ್ಟಿವೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ — ನಮ್ಮ ನಾಲೆಡ್ಜ್ ಹಬ್‌ನಲ್ಲಿ ಮಾರ್ಗದರ್ಶಿ ಇದೆ.",
    default: "ಒಳ್ಳೆಯ ಪ್ರಶ್ನೆ — ಪೂರ್ಣ ಆವೃತ್ತಿಯಲ್ಲಿ ನಾನು ಇದನ್ನು ನಿಮ್ಮ ಪ್ರದೇಶದ ಕೃಷಿ ದತ್ತಾಂಶದ ಮೇಲೆ ತರಬೇತಿ ಪಡೆದ AI ಮಾದರಿಯೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸುತ್ತೇನೆ. ಸದ್ಯಕ್ಕೆ ಕ್ರಾಪ್ ಡಾಕ್ಟರ್, ನಾಲೆಡ್ಜ್ ಹಬ್ ಅಥವಾ ಎಕ್ಸ್‌ಪರ್ಟ್ ಸೇವೆಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದು."
  },
};

function classifyTopic(text: string): keyof typeof MOCK_REPLIES['en'] {
  const lower = text.toLowerCase();
  if (/fertil|npk|உரம்|उर्वरक|ఎరువు|ಗೊಬ್ಬರ|dosage|dose/.test(lower)) return 'fertilizer';
  if (/weather|rain|வானிலை|मौसम|వాతావరణ|ಹವಾಮಾನ|monsoon/.test(lower)) return 'weather';
  if (/disease|curl|blight|pest|நோய்|बीमारी|వ్యాధి|ರೋಗ|நோய்த்/.test(lower)) return 'disease';
  if (/scheme|pm-kisan|kisan|loan|திட்டம்|योजना|పథక|ಯೋಜನೆ|subsidy/.test(lower)) return 'scheme';
  return 'default';
}

let msgCounter = 0;
const nextId = () => `msg-${Date.now()}-${msgCounter++}`;

export default function AIAssistantWidget({ lang }: AIAssistantWidgetProps) {
  const [open, setOpen] = useState(false);
  const [assistantLang, setAssistantLang] = useState<AssistantLang>(lang === 'ta' ? 'ta' : 'en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ui = UI_TEXT[assistantLang];

  // Seed greeting whenever the chat is opened for the first time (or language changes with empty history)
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: nextId(), from: 'bot', text: ui.greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: nextId(), from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const topic = classifyTopic(trimmed);
      const reply = MOCK_REPLIES[assistantLang][topic];
      setMessages(prev => [...prev, { id: nextId(), from: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1100 + Math.random() * 700);
  };

  const switchLanguage = (code: AssistantLang) => {
    setAssistantLang(code);
    setShowLangMenu(false);
    // Re-seed the greeting in the newly selected language for a fresh conversation
    setMessages([{ id: nextId(), from: 'bot', text: UI_TEXT[code].greeting }]);
  };

  return (
    <>
      {/* Floating launcher button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 bg-[#1B6B3A] hover:bg-[#155530] text-white shadow-xl rounded-full pl-4 pr-5 py-3.5 transition group"
          aria-label="Open AI Agriculture Assistant"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <Bot className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#E8A020] border-2 border-[#1B6B3A]"></span>
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider hidden sm:inline">
            {lang === 'ta' ? 'AI உதவியாளர்' : 'AI Assistant'}
          </span>
          <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[60] w-[92vw] max-w-sm h-[32rem] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-[#1B6B3A] text-white px-4 py-3.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold leading-tight truncate">{ui.title}</p>
                <p className="text-[10px] text-emerald-100 leading-tight truncate">{ui.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="h-7 w-7 rounded-full hover:bg-white/15 flex items-center justify-center shrink-0" aria-label="Close assistant">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Language switcher */}
          <div className="relative bg-[#F7F9F4] border-b border-slate-100 px-4 py-2 flex items-center justify-between shrink-0">
            <button
              onClick={() => setShowLangMenu(v => !v)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B6B3A]"
            >
              <Globe className="h-3.5 w-3.5" />
              {LANGUAGES.find(l => l.code === assistantLang)?.native}
              <span className="text-slate-400">▾</span>
            </button>
            <span className="text-[10px] text-slate-400 inline-flex items-center gap-1">
              <MessageCircle className="h-3 w-3" /> {lang === 'ta' ? 'வலைதளம் · WhatsApp · செயலி' : 'Website · WhatsApp · App'}
            </span>

            {showLangMenu && (
              <div className="absolute top-full left-3 mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-10 w-40">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => switchLanguage(l.code)}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-[#1B6B3A]/10 transition flex items-center justify-between ${assistantLang === l.code ? 'text-[#1B6B3A]' : 'text-slate-600'}`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] text-slate-400">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white">
            {messages.map(m => (
              <div key={m.id} className={`flex items-start gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${m.from === 'user' ? 'bg-[#1B6B3A]/10 text-[#1B6B3A]' : 'bg-[#E8A020]/15 text-[#9c6c0c]'}`}>
                  {m.from === 'user' ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`max-w-[78%] text-xs leading-relaxed rounded-2xl px-3.5 py-2.5 ${m.from === 'user' ? 'bg-[#1B6B3A] text-white rounded-tr-sm' : 'bg-[#F7F9F4] text-slate-700 rounded-tl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="h-7 w-7 rounded-full bg-[#E8A020]/15 text-[#9c6c0c] flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-[#F7F9F4] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.2s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.1s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce"></span>
                </div>
              </div>
            )}

            {/* Quick prompts (shown only at the start of a conversation) */}
            {messages.length <= 1 && !isTyping && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ui.quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p)}
                    className="text-[10.5px] font-semibold text-[#1B6B3A] bg-[#1B6B3A]/8 hover:bg-[#1B6B3A]/15 border border-[#1B6B3A]/15 rounded-full px-3 py-1.5 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demo notice */}
          <p className="px-4 pb-1.5 text-[9.5px] text-slate-400 leading-snug shrink-0">{ui.demoNotice}</p>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="border-t border-slate-100 p-2.5 flex items-center gap-2 shrink-0 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ui.placeholder}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/30 focus:border-[#1B6B3A]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="h-9 w-9 rounded-full bg-[#1B6B3A] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#155530] transition shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
