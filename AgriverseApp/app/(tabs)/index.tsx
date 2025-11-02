import React, { useEffect, useRef, useState } from 'react';

import { ActivityIndicator, Alert, Animated, Button, Dimensions, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { LineChart, PieChart } from 'react-native-chart-kit';



const screenWidth = Dimensions.get("window").width;



// Automatically selects the correct API URL

const API_URL = Platform.OS === 'web' ? 'http://localhost:8000' : 'https://agriverse-fastapi-1.onrender.com';



// --- COLOR DEFINITIONS ---

const PRIMARY_DARK = '#1a1a2e';

const SECONDARY_CARD = '#2a2a4a';

const ACCENT_COLOR = '#4CAF50';

const TEXT_COLOR = '#F0F0F0';

const WARNING_COLOR = '#FFA500';

const WEATHER_COLOR = '#5DADE2';

const RUPEE_SYMBOL = '\u20B9';

const STATEMENT_COLOR = '#A020F0'; // Purple for Statements

const TAX_COLOR = '#FF7F50'; // Coral for Tax



// CROP COLORS

const CROP_COLORS = {

Tomato: '#FF6347', Onion: '#FFC300', Wheat: '#58D68D', Rice: '#3498DB', Chilli: '#AF7AC5',

Cotton: '#4A607A', Potato: '#E67E22', Maize: '#FFDC00', Mustard: '#D68910', Soybean: '#1F618D',

Coffee: '#7D6608', Sugarcane: '#1ABC9C',

};



// --- SCHEME DATABASE ---

const SCHEMES_DATABASE = [

{ id: 'S1', name: 'PM-KISAN', type: 'DBT', benefit: '₹6000 Annual Transfer', eligibility: 'All Farmers', color: ACCENT_COLOR },

{ id: 'S2', name: 'PM Fasal Bima Yojana (PMFBY)', type: 'Insurance', benefit: 'Crop Insurance Coverage', eligibility: 'All Farmers', color: '#6A5ACD' },

{ id: 'S3', name: 'Farm Mechanization Subsidy', type: 'Grant', benefit: '25-50% Subsidy on Equipment', eligibility: 'SMF (Small/Marginal Farmers)', color: '#FF7F50' },

{ id: 'S4', name: 'PM Krishi Sinchayee Yojana (PMKSY)', type: 'Subsidy', benefit: 'Drip/Sprinkler System Grant', eligibility: 'All Farmers', color: WEATHER_COLOR },

{ id: 'S5', name: 'Soil Health Card (SHC)', type: 'Service', benefit: 'Free Soil Testing & NPK Recommendation', eligibility: 'All Farmers', color: WARNING_COLOR },

];

// --- END SCHEME DATABASE ---



// --- TRANSLATION DATA ---

const TRANSLATIONS = {

en: {

HEADER: "AgriCoach", FINANCIAL_ASSISTANT: "Financial Assistant (AI)", FINANCIAL_PROMPT: "Ask about loans, subsidies, etc.", ASK_AI_BUTTON: "Gemini AI AGENT", AI_RESPONSE_HEADER: "AI Response:", MARKET_INTELLIGENCE: "Market Intelligence",

PROMPT_CROP_SELECTION: "1. Please select a crop:", BEST_MANDI_HEADER: "🏆 Best Mandi to Sell:", PRICES_TRENDS: "Prices and Trends for ", SELECT_NEW_CROP: "<< Select New Crop", PNL_ANALYSIS: "Profit & Loss Analysis",

PROMPT_PNL_SELECTION: "Select crop for P&L breakdown:", PNL_ADVICE_NO_INPUT: "Tap a crop button above to view detailed P&L analysis.", DEMAND_FORECAST: "Demand Forecast (Next Season)",

PROMPT_REGION_SELECTION: "Select your region to plan your next cycle:", FORECAST_FOR: "Forecast for", PRIMARY_REC: "🥇 Primary Recommendation:", SECONDARY_OPTIONS: "Secondary Options:", SELECT_NEW_REGION: "<< Select New Region", WEATHER_FORECAST: "Weather Forecast 🌦️",

WEATHER_PROMPT: "Select region for weather:", WEATHER_IN: "Weather in", NO_DATA: "Select a crop to begin.", CLOSE_ANALYSIS: "Close Analysis", COST: "Cost", REVENUE: "Revenue", NET_IMPACT_SCORE: "Net Impact Score:", ADVICE: "Advice:",

FACTOR: "Factor", IMPACT: "Impact", REASON: "Reason", TAP_TO_LEARN: "[Tap to Learn]", AI_INSIGHT: "AI Insight",

PNL_YIELD: "Expected Yield (kg):", PNL_PRICE: "Expected Price (₹/kg):", PNL_FERTILIZER: "Fertilizer Cost (₹):", PNL_PESTICIDE: "Pesticide Cost (₹):", PNL_LABOUR: "Labour Cost (₹):", PNL_OTHER: "Other Costs (₹):",

CROP_Tomato: "Tomato", CROP_Onion: "Onion", CROP_Wheat: "Wheat", CROP_Rice: "Rice", CROP_Chilli: "Chilli", CROP_Cotton: "Cotton", CROP_Potato: "Potato", CROP_Maize: "Maize", CROP_Mustard: "Mustard", CROP_Soybean: "Soybean", CROP_Coffee: "Coffee", CROP_Sugarcane: "Sugarcane",

STATUS_DEFAULT: "Select an option to begin.", STATUS_FETCHING_WEATHER: (mandi) => `Fetching weather for ${mandi}...`, STATUS_WEATHER_UPDATED: "Weather updated.", STATUS_WEATHER_FAILED: "Failed to fetch weather.", STATUS_FETCHING_FORECAST: (mandi) => `Fetching data for ${mandi}...`,

STATUS_FORECAST_READY: (mandi) => `Data ready for ${mandi}.`, STATUS_SELECTED_CROP: (crop) => `${crop} selected. Now fetching prices...`, STATUS_FETCHING_PRICES: (crop) => `Fetching prices for ${crop}...`, STATUS_PRICES_FETCHED: (crop) => `Data fetched for ${crop}!`,

STATUS_ERROR_PRICES: "Error fetching prices. Check server.", STATUS_INPUT_REQUIRED: "Please type a question before asking the AI.", STATUS_ASKING_AI: "Asking AI assistant...", STATUS_AI_RESPONDED: "AI has responded.", STATUS_AI_ERROR: "Error connecting to AI. Check server.",

STATUS_FETCHING_PNL: (crop) => `Fetching P&L analysis for ${crop}...`, STATUS_ERROR_PNL: "Could not fetch P&L analysis data.",

TAB_HOME: "Home", TAB_MARKET: "Market", TAB_PLANNING: "Planning", TAB_FINANCE: "Finance", TAB_STATEMENTS: "Statements", TAB_TAX: "Tax & Savings", TAB_ADVISOR: "Advisor", TAB_WEATHER: "Weather",

CROP_HEALTH_ANALYST: "Crop Health Analyst 📸", PEST_DIAGNOSIS_PROMPT: "Upload leaf photo for instant Pest/Disease diagnosis.", UPLOAD_PHOTO: "Upload Photo", DIAGNOSIS_RESULT: "Diagnosis:", NO_DIAGNOSIS: "No issue detected.",

INPUT_OPTIMIZER: "Input Cost Optimizer", OPTIMIZER_ADVICE: "Optimizer Advice:", IRRIGATION_SCHEDULER: "Smart Irrigation Scheduler 💧", IRRIGATION_SCHEDULE: "Irrigation Schedule for {crop}:", NEXT_WATERING: "Next Watering:", WATER_AMOUNT: "Water Amount:", IRRIGATION_ADVICE: "Advice:", EXTENDED_FORECAST: "Extended 15-Day Outlook",

DASHBOARD_TITLE: "Welcome Farmer! Select a service:", DASHBOARD_MARKET_DESC: "Prices, Selling Advice, P&L Analysis.", DASHBOARD_PLANNING_DESC: "Crop Demand, Yield Planning, Irrigation.", DASHBOARD_FINANCE_DESC: "Loans, Subsidies & Cash Flow Tracking.", DASHBOARD_WEATHER_DESC: "Current and Extended Forecast.",

SOIL_NUTRITION: "Soil & Nutrition Mgmt. 🧪", FERTILIZER_SUGGESTION: "Fertilizer Recommendation:", GET_FERTILIZER: "Get Recommendation", SOIL_TYPE: "Soil Type:", SOIL_TREATMENT: "Treatment:", NPK_SUGGESTION: "NPK (Kg/Hectare):", MICRO_NUTRIENTS: "Micronutrients:",

CASH_FLOW_TRACKER: "Cash Flow Tracker 💵", LOG_NEW_ENTRY: "Log New Transaction", ENTRY_DESCRIPTION: "Description (e.g., Labor, Seed Sale)", ENTRY_TYPE: "Type", INCOME: "Income", EXPENSE: "Expense", LOG_BUTTON: "Log Entry", NET_CASH_FLOW: "Net Cash Flow:", TOTAL_INCOME: "Total Income:", TOTAL_EXPENSES: "Total Expenses:",

// --- LOAN/SUBSIDY KEYS ---

LOAN_SUBSIDY_HUB: "Loan & Subsidy Hub 🏦", ACTIVE_LOAN: "Active Loan:", SCHEME_KCC: "Kisan Credit Card (KCC)", LOAN_AMOUNT: "Loan Amount:", NEXT_REPAYMENT: "Next Repayment Due:", REPAYMENT_ALERT: "Repayment Alert!", SUBSIDY_STATUS: "Subsidy Status:", PM_KISAN: "PM-KISAN (Annual)", STATUS_APPROVED: "Approved", STATUS_PENDING: "Pending", CHECK_STATUS: "Check Status",

ADD_LOAN: "+ Add New Loan/Subsidy", LOAN_NAME: "Loan Name/Scheme:", LOAN_REPAYMENT_DATE: "Repayment Date (YYYY-MM-DD):", SUBSIDY_NAME: "Subsidy Name:", SUBMIT_LOAN: "Save Details",

GOVT_SCHEMES: "Govt. Schemes Portal 📢", SCHEME_BENEFIT: "Benefit:", SCHEME_ELIGIBILITY: "Eligibility:", SCHEME_APPLY: "Apply Now",

AI_SELLING_ADVISOR: "AI Selling Advisor 💡", ADVISOR_PROMPT: "Select a crop to receive the best time and place to sell.", ADVISOR_REC_HEADER: "Optimal Selling Recommendation:", NET_PROFIT: "Net Profit Margin:", TRANSPORT_COST: "Est. Transport Cost:", SELLING_TIME: "Best Time to Sell:", SELL_NOW: "Sell Now (Price Stable)", SELL_LATER: "Wait 3 Days (Price Up)", ADVISOR_MARKET_INTELLIGENCE: "Market Intelligence",

ADVISOR_DISTANCE: "Distance (Km):", ADVISOR_TRANSPORT: "Transport Cost:", ADVISOR_LOCATION: "Farm Location:",

// --- NEW FINANCE DASHBOARD KEYS ---

DASHBOARD_SUMMARY: "Financial Overview", EXPENSE_BREAKDOWN: "Expense Breakdown", INCOME_BREAKDOWN: "Income Source Breakdown", UPLOAD_BILL: "Upload Receipt 🧾", TRANSACTION_RECORD: "Transaction History",

CAT_LABOR: "Labor", CAT_FERTILIZER: "Fertilizer", CAT_PESTICIDE: "Pesticide", CAT_STORAGE: "Storage", CAT_MACHINERY: "Machinery/Repair", CAT_OTHER: "Other",

// --- INCOME CATEGORIES ---

INC_CROP: "Crop Sales (Wheat)", INC_LIVESTOCK: "Livestock/Dairy", INC_SUPPORT: "Govt. Support/DBT", INC_OTHER: "Other Income",

// --- STATEMENTS TAB KEYS ---

PL_SUMMARY: "Profit & Loss Statement (Annual)", LOAN_SCHEDULE_HEADER: "Loan Repayment Schedule",

GROSS_REVENUE: "Gross Revenue", COGS: "Cost of Goods Sold", GROSS_PROFIT: "Gross Profit", OP_EXPENSE: "Operating Expense", NET_PROFIT: "Net Profit",

LOAN_NAME_SCH: "Loan Name/Scheme", AMOUNT_DUE: "Amount Due", DUE_DATE: "Due Date",

// --- TAX & SAVINGS KEYS ---

TAX_SAVINGS_HUB: "Tax & Savings Hub 💼", TAX_DOCUMENTS: "Tax Document Upload", TAX_ADVICE: "Tax Savings Advice:", INV_ADVICE: "Investment Recommendation:", UPLOAD_DOCS: "Upload Tax Documents", INV_AMOUNT: "Target Monthly Investment:",

},

hi: {

HEADER: " एग्रीकोच", FINANCIAL_ASSISTANT: "वित्तीय सहायक (एआई)", FINANCIAL_PROMPT: "ऋण, सब्सिडी आदि के बारे में पूछें।", ASK_AI_BUTTON: "AMAZON BEDROCK AI AGENT", AI_RESPONSE_HEADER: "एआई प्रतिक्रिया:", MARKET_INTELLIGENCE: "बाजार बुद्धिमत्ता",

PROMPT_CROP_SELECTION: "1. कृपया एक फसल चुनें:", BEST_MANDI_HEADER: "🏆 बेचने के लिए सर्वश्रेष्ठ मंडी:", PRICES_TRENDS: "कीमतें और रुझान ", SELECT_NEW_CROP: "<< नई फसल चुनें", PNL_ANALYSIS: "लाभ और हानि विश्लेषण",

PROMPT_PNL_SELECTION: "पी एंड एल ब्रेकडाउन के लिए फसल चुनें:", PNL_ADVICE_NO_INPUT: "विस्तृत पी एंड एल विश्लेषण देखने के लिए ऊपर दिए गए फसल बटन पर टैप करें।", DEMAND_FORECAST: "मांग पूर्वानुमान (अगला सीजन)",

PROMPT_REGION_SELECTION: "अपने अगले चक्र की योजना बनाने के लिए अपना क्षेत्र चुनें:", FORECAST_FOR: "के लिए पूर्वानुमान", PRIMARY_REC: "🥇 प्राथमिक सिफारिश:", SECONDARY_OPTIONS: "माध्यमिक विकल्प:", SELECT_NEW_REGION: "<< नया क्षेत्र चुनें", WEATHER_FORECAST: "मौसम का पूर्वानुमान 🌦️",

WEATHER_PROMPT: "मौसम के लिए क्षेत्र चुनें:", WEATHER_IN: "में मौसम", NO_DATA: "शुरुआत करने के लिए एक फसल चुनें।", CLOSE_ANALYSIS: "विश्लेषण बंद करें", COST: "लागत", REVENUE: "राजस्व", NET_IMPACT_SCORE: "शुद्ध प्रभाव स्कोर:", ADVICE: "सलाह:",

FACTOR: "कारक", IMPACT: "प्रभाव", REASON: "कारण", TAP_TO_LEARN: "[सीखने के लिए टैप करें]", AI_INSIGHT: "एआई अंतर्दृष्टि",

PNL_YIELD: "अपेक्षित उपज (किलो):", PNL_PRICE: "अपेक्षित मूल्य (₹/किलो):", PNL_FERTILIZER: "उर्वरक लागत (₹):", PNL_PESTICIDE: "कीटनाशक लागत (₹):", PNL_LABOUR: "श्रम लागत (₹):", PNL_OTHER: "अन्य लागतें (₹):",

CROP_Tomato: "टमाटर", CROP_Onion: "प्याज", CROP_Wheat: "गेहूं", CROP_Rice: "चावल", CROP_Chilli: "मिर्च", CROP_Cotton: "कपास", CROP_Potato: "आलू", CROP_Maize: "मक्का", CROP_Mustard: "सरसों", CROP_Soybean: "सोयाबीन", CROP_Coffee: "कॉफी", CROP_Sugarcane: "गन्ना",

STATUS_DEFAULT: "आरंभ करने के लिए एक विकल्प चुनें।", STATUS_FETCHING_WEATHER: (mandi) => `${mandi} के लिए मौसम डेटा प्राप्त कर रहा है...`, STATUS_WEATHER_UPDATED: "मौसम अद्यतन।", STATUS_WEATHER_FAILED: "मौसम डेटा प्राप्त करने में विफल।", STATUS_FETCHING_FORECAST: (mandi) => `${mandi} के लिए डेटा प्राप्त कर रहा है...`,

STATUS_FORECAST_READY: (mandi) => `${mandi} के लिए डेटा तैयार है।`, STATUS_SELECTED_CROP: (crop) => `${TRANSLATIONS.hi['CROP_' + crop]} चुना गया। अब कीमतें प्राप्त कर रहे हैं...`, STATUS_FETCHING_PRICES: (crop) => `${TRANSLATIONS.hi['CROP_' + crop]} के लिए कीमतें प्राप्त कर रहा है...`, STATUS_PRICES_FETCHED: (crop) => `${TRANSLATIONS.hi['CROP_' + crop]} के लिए डेटा प्राप्त हुआ!`,

STATUS_ERROR_PRICES: "कीमतें प्राप्त करने में त्रुटि। सर्वर की जांच करें।", STATUS_INPUT_REQUIRED: "कृपया एआई से पूछने से पहले एक प्रश्न टाइप करें।", STATUS_ASKING_AI: "एआई सहायक से पूछ रहा है...", STATUS_AI_RESPONDED: "एआई ने जवाब दिया है।", STATUS_AI_ERROR: "एआई सहायक से जुड़ने में त्रुटि।",

STATUS_FETCHING_PNL: (crop) => `${TRANSLATIONS.hi['CROP_' + crop]} के लिए पी एंड एल विश्लेषण प्राप्त कर रहा है...`, STATUS_ERROR_PNL: "पी एंड एल विश्लेषण डेटा प्राप्त नहीं किया जा सका।",

TAB_HOME: "होम", TAB_MARKET: "बाज़ार", TAB_PLANNING: "योजना", TAB_FINANCE: "वित्त", TAB_STATEMENTS: "विवरण", TAB_TAX: "कर और बचत", TAB_ADVISOR: "सलाहकार", TAB_WEATHER: "मौसम",

CROP_HEALTH_ANALYST: "फसल स्वास्थ्य विश्लेषक 📸", PEST_DIAGNOSIS_PROMPT: "कीट/रोग के निदान के लिए पत्ती की फोटो अपलोड करें।", UPLOAD_PHOTO: "फोटो अपलोड करें", DIAGNOSIS_RESULT: "निदान:", NO_DIAGNOSIS: "कोई समस्या नहीं पाई गई।",

INPUT_OPTIMIZER: "इनपुट लागत अनुकूलक", OPTIMIZER_ADVICE: "अनुकूलक सलाह:", IRRIGATION_SCHEDULER: "स्मार्ट सिंचाई अनुसूचक 💧", IRRIGATION_SCHEDULE: "{crop} के लिए सिंचाई अनुसूची:", NEXT_WATERING: "अगली सिंचाई:", WATER_AMOUNT: "पानी की मात्रा:", IRRIGATION_ADVICE: "सलाह:", EXTENDED_FORECAST: "विस्तृत 15-दिवसीय आउटलुक",

DASHBOARD_TITLE: "स्वागत है किसान! एक सेवा चुनें:", DASHBOARD_MARKET_DESC: "कीमतें, बेचने की सलाह, P&L विश्लेषण।", DASHBOARD_PLANNING_DESC: "फसल मांग, उपज योजना, सिंचाई।", DASHBOARD_FINANCE_DESC: "ऋण, सब्सिडी और नकदी प्रवाह ट्रैकिंग।", DASHBOARD_WEATHER_DESC: "वर्तमान और विस्तृत पूर्वानुमान।",

SOIL_NUTRITION: "मिट्टी और पोषण प्रबंधन 🧪", FERTILIZER_SUGGESTION: "उर्वरक सिफारिश:", GET_FERTILIZER: "सिफारिश प्राप्त करें", SOIL_TYPE: "मिट्टी का प्रकार:", SOIL_TREATMENT: "उपचार:", NPK_SUGGESTION: "एनपीके (किलो/हेक्टेयर):", MICRO_NUTRIENTS: "सूक्ष्म पोषक तत्व:",

CASH_FLOW_TRACKER: "कैश फ्लो ट्रैकर 💵", LOG_NEW_ENTRY: "नया लेनदेन लॉग करें", ENTRY_DESCRIPTION: "विवरण (जैसे, श्रम, बीज बिक्री)", ENTRY_TYPE: "प्रकार", INCOME: "आय", EXPENSE: "व्यय", LOG_BUTTON: "एंट्री लॉग करें", NET_CASH_FLOW: "शुद्ध नकदी प्रवाह:", TOTAL_INCOME: "कुल आय:", TOTAL_EXPENSES: "कुल व्यय:",

// --- LOAN/SUBSIDY KEYS ---

LOAN_SUBSIDY_HUB: "ऋण और सब्सिडी हब 🏦", ACTIVE_LOAN: "सक्रिय ऋण:", SCHEME_KCC: "किसान क्रेडिट कार्ड (KCC)", LOAN_AMOUNT: "ऋण राशि:", NEXT_REPAYMENT: "अगली चुकौती देय:", REPAYMENT_ALERT: "चुकौती अलर्ट!", SUBSIDY_STATUS: "सब्सिडी की स्थिति:", PM_KISAN: "पीएम-किसान (वार्षिक)", STATUS_APPROVED: "अनुमोदित", STATUS_PENDING: "विचाराधीन", CHECK_STATUS: "स्थिति जांचें",

ADD_LOAN: "+ नया ऋण/सब्सिडी जोड़ें", LOAN_NAME: "ऋण का नाम/योजना:", LOAN_REPAYMENT_DATE: "चुकौती की तारीख (YYYY-MM-DD):", SUBSIDY_NAME: "सब्सिडी का नाम:", SUBMIT_LOAN: "विवरण सहेजें",

GOVT_SCHEMES: "सरकारी योजना पोर्टल 📢", SCHEME_BENEFIT: "लाभ:", SCHEME_ELIGIBILITY: "पात्रता:", SCHEME_APPLY: "अभी आवेदन करें",

AI_SELLING_ADVISOR: "एआई बिक्री सलाहकार 💡", ADVISOR_PROMPT: "बेचने का सबसे अच्छा समय और स्थान प्राप्त करने के लिए एक फसल चुनें।", ADVISOR_REC_HEADER: "इष्टतम बिक्री सिफारिश:", NET_PROFIT: "शुद्ध लाभ मार्जिन:", TRANSPORT_COST: "अनुमानित परिवहन लागत:", SELLING_TIME: "बेचने का सबसे अच्छा समय:", SELL_NOW: "अभी बेचें (कीमत स्थिर)", SELL_LATER: "3 दिन प्रतीक्षा करें (कीमत बढ़ेगी)", ADVISOR_MARKET_INTELLIGENCE: "बाजार बुद्धिमत्ता",

ADVISOR_DISTANCE: "दूरी (किमी):", ADVISOR_TRANSPORT: "परिवहन लागत:", ADVISOR_LOCATION: "फार्म स्थान:",

// --- NEW FINANCE DASHBOARD KEYS ---

DASHBOARD_SUMMARY: "वित्तीय अवलोकन", EXPENSE_BREAKDOWN: "व्यय ब्रेकडाउन", INCOME_BREAKDOWN: "आय स्रोत ब्रेकडाउन", UPLOAD_BILL: "रसीद अपलोड करें 🧾", TRANSACTION_RECORD: "लेनदेन इतिहास",

CAT_LABOR: "श्रम", CAT_FERTILIZER: "उर्वरक", CAT_PESTICIDE: "कीटनाशक", CAT_STORAGE: "भंडारण", CAT_MACHINERY: "मशीनरी/मरम्मत", CAT_OTHER: "अन्य",

// --- INCOME CATEGORIES ---

INC_CROP: "फसल बिक्री (गेहूं)", INC_LIVESTOCK: "पशुधन/डेयरी", INC_SUPPORT: "सरकारी सहायता/डीबीटी", INC_OTHER: "अन्य आय",

// --- STATEMENTS TAB KEYS ---

PL_SUMMARY: "लाभ और हानि विवरण (वार्षिक)", LOAN_SCHEDULE_HEADER: "ऋण चुकौती अनुसूची",

GROSS_REVENUE: "सकल राजस्व", COGS: "बेचे गए माल की लागत", GROSS_PROFIT: "सकल लाभ", OP_EXPENSE: "परिचालन व्यय", NET_PROFIT: "शुद्ध लाभ",

LOAN_NAME_SCH: "ऋण का नाम/योजना", AMOUNT_DUE: "देय राशि", DUE_DATE: "देय तिथि",

// --- TAX & SAVINGS KEYS ---

TAX_SAVINGS_HUB: "कर और बचत हब 💼", TAX_DOCUMENTS: "कर दस्तावेज़ अपलोड करें", TAX_ADVICE: "कर बचत सलाह:", INV_ADVICE: "निवेश की सिफारिश:", UPLOAD_DOCS: "कर दस्तावेज़ अपलोड करें", INV_AMOUNT: "लक्षित मासिक निवेश:",

},

te: {

HEADER: "కৃষిసలహాదారు", FINANCIAL_ASSISTANT: "ఆర్థిక సహాయకుడు (AI)", FINANCIAL_PROMPT: "రుణాలు, సబ్సిడీలు మొదలైన వాటి గురించి అడగండి.", ASK_AI_BUTTON: "AMAZON BEDROCK AI AGENT", AI_RESPONSE_HEADER: "AI ప్రతిస్పందన:", MARKET_INTEలిజెన్స్: "మార్కెట్ ఇంటెలిజెన్స్",

PROMPT_CROP_SELECTION: "1. దయచేసి ఒక పంటను ఎంచుకోండి:", BEST_MANDI_HEADER: "🏆 అమ్మడానికి ఉత్తమ మార్కెట్:", PRICES_TRENDS: "ధరలు మరియు ట్రెండ్‌లు ", SELECT_NEW_CROP: "<< కొత్త పంటను ఎంచుకోండి", PNL_ANALYSIS: "లాభం & నష్టం విశ్లేషణ",

PROMPT_PNL_SELECTION: "P&L విశ్లేషణ కోసం పంటను ఎంచుకోండి:", PNL_ADVICE_NO_INPUT: "వివరణాత్మక P&L విశ్లేషణను చూడటానికి పై పంట బటన్‌ను నొక్కండి.", DEMAND_FORECAST: "డిమాండ్ అంచనా (తదుపరి సీజన్)",

PROMPT_REGION_SELECTION: "మీ తదుపరి చక్రం ప్లాన్ చేయడానికి మీ ప్రాంతాన్ని ఎంచుకోండి:", FORECAST_FOR: "కొరకు అంచనా", PRIMARY_REC: "🥇 ప్రాథమిక సిఫార్సు:", SECONDARY_OPTIONS: "ద్వితీయ ఎంపికలు:", SELECT_NEW_REGION: "<< కొత్త ప్రాంతాన్ని ఎంచుకోండి", WEATHER_FORECAST: "వాతావరణ సూచన 🌦️",

WEATHER_PROMPT: "వాతావరణం కోసం ప్రాంతాన్ని ఎంచుకోండి:", WEATHER_IN: "లో వాతావరణం", NO_DATA: "ప్రారంభించడానికి ఒక పంటను ఎంచుకోండి.", CLOSE_ANALYSIS: "విశ్లేషణను మూసివేయండి", COST: "ఖర్చు", REVENUE: "ఆదాయం", NET_IMPACT_SCORE: "నికర ప్రభావ స్కోర్:", ADVICE: "సలహా:",

FACTOR: "కారణం", IMPACT: "ప్రభావం", REASON: "వివరణ", TAP_TO_LEARN: "[నేర్చుకోవడానికి నొక్కండి]", AI_INSIGHT: "AI అంతర్దృష్టి",

PNL_YIELD: "అంచనా దిగుబడి (కిలో):", PNL_PRICE: "అంచనా ధర (₹/కిలో):", PNL_FERTILIZER: "ఎరువుల ఖర్చు (₹):", PNL_PESTICIDE: "పురుగుమందుల ఖర్చు (₹):", PNL_LABOUR: "శ్రమ ఖర్చు (₹):", PNL_OTHER: "ఇతర ఖర్చులు (₹):",

CROP_Tomato: "టమాటా", CROP_Onion: "ఉల్లి", CROP_Wheat: "గోధుమ", CROP_Rice: "వరి", CROP_Chilli: "మిరప", CROP_Cotton: "పత్తి", CROP_Potato: "ఆలు", CROP_Maize: "మొక్కజొన్న", CROP_Mustard: "ఆవాలు", CROP_Soybean: "సోయాబీన్", CROP_Coffee: "కాఫీ", CROP_Sugarcane: "చెరకు",

STATUS_DEFAULT: "ప్రారంభించడానికి ఒక ఆప్షన్ ఎంచుకోండి。", STATUS_FETCHING_WEATHER: (mandi) => `${mandi} కోసం వాతావరణ డేటాను పొందుతోంది...`, STATUS_WEATHER_UPDATED: "వాతావరణం నవీకరించబడింది。", STATUS_WEATHER_FAILED: "వాతావరణ డేటాను పొందడంలో విఫలమైంది。", STATUS_FETCHING_FORECAST: (mandi) => `${mandi} కోసం డేటాను పొందుతోంది...`,

STATUS_FORECAST_READY: (mandi) => `${mandi} కోసం డేటా సిద్ధంగా ఉంది!`, STATUS_SELECTED_CROP: (crop) => `${TRANSLATIONS.te['CROP_' + crop]} ఎంచుకోబడింది。 ఇప్పుడు ధరలు పొందుతోంది...`, STATUS_FETCHING_PRICES: (crop) => `${TRANSLATIONS.te['CROP_' + crop]} కోసం ధరలు పొందుతోంది...`, STATUS_PRICES_FETCHED: (crop) => `${TRANSLATIONS.te['CROP_' + crop]} కోసం డేటా పొందబడింది!`,

STATUS_ERROR_PRICES: "ధరలు పొందడంలో లోపం。 సర్వర్‌ని తనిఖీ చేయండి。", STATUS_INPUT_REQUIRED: "AIని అడగడానికి ముందు దయచేసి ఒక ప్రశ్న టైప్ చేయండి。", STATUS_ASKING_AI: "AI సహాయకుడిని అడుగుతోంది...", STATUS_AI_RESPONDितः: "AI ప్రతిస్పందించింది。", STATUS_AI_ERROR: "AI సహాయకుడికి కనెక్ట్ చేయడంలో లోపం。",

STATUS_FETCHING_PNL: (crop) => `${TRANSLATIONS.te['CROP_' + crop]} కోసం P&L విశ్లేషణను పొందుతోంది...`, STATUS_ERROR_PNL: "P&L విశ్లేషణ డేటాను పొందలేకపోయింది。",

TAB_HOME: "హోమ్", TAB_MARKET: "మార్కెట్", TAB_PLANNING: "ప్లానింగ్", TAB_FINANCE: "ఫైనాన్స్", TAB_STATEMENTS: "ప్రకటనలు", TAB_TAX: "పన్ను & పొదుపు", TAB_ADVISOR: "సలహాదారు", TAB_WEATHER: "వాతావరణం",

CROP_HEALTH_ANALYST: "పంట ఆరోగ్య విశ్లేషకుడు 📸", PEST_DIAGNOSIS_PROMPT: "తక్షణ రోగనిర్ధారణ కోసం ఆకు ఫోటోను అప్‌లోడ్ చేయండి.", UPLOAD_PHOTO: "ఫోటో అప్‌లోడ్ చేయండి", DIAGNOSIS_RESULT: "రోగనిర్ధారణ:", NO_DIAGNOSIS: "సమస్య కనుగొనబడలేదు。",

INPUT_OPTIMIZER: "ఇన్పుట్ ధర ఆప్టిమైజర్", OPTIMIZER_ADVICE: "ఆప్టిమైజర్ సలహా:", IRRIGATION_SCHEDULER: "స్మార్ట్ నీటిపారుదల షెడ్యూలర్ 💧", IRRIGATION_SCHEDULE: "{crop} కొరకు నీటిపారుదల షెడ్యూల్:", NEXT_WATERING: "తదుపరి నీటిపారుదల:", WATER_AMOUNT: "నీటి పరిమాణం:", IRRIGATION_ADVICE: "సలహా:", EXTENDED_FORECAST: "విస్తరించిన 15-రోజుల ఔట్లుక్",

DASHBOARD_TITLE: "రైతులకు స్వాగతం! ఒక సేవను ఎంచుకోండి:", DASHBOARD_MARKET_DESC: "ధరలు, అమ్మకం సలహా, P&L విశ్లేషణ.", DASHBOARD_PLANNING_DESC: "పంట డిమాండ్, దిగుబడి ప్రణాళిక, నీటిపారుదల.", DASHBOARD_FINANCE_DESC: "రుణాలు, సబ్సిడీలు & నగదు ప్రవాహ ట్రాకింగ్.", DASHBOARD_WEATHER_DESC: "ప్రస్తుత మరియు విస్తరించిన వాతావరణ అంచనా.",

SOIL_NUTRITION: "నేల & పోషక నిర్వహణ 🧪", FERTILIZER_SUGGESTION: "ఎరువుల సిఫార్సు:", GET_FERTILIZER: "సిఫార్సు పొందండి", SOIL_TYPE: "నేల రకం:", SOIL_TREATMENT: "చికిత్స:", NPK_SUGGESTION: "NPK (Kg/హెక్టారుకు):", MICRO_NUTRIENTS: "సూక్ష్మ పోషకాలు:",

CASH_FLOW_TRACKER: "నగదు ప్రవాహం ట్రాకర్ 💵", LOG_NEW_ENTRY: "కొత్త లావాదేవీని లాగ్ చేయండి", ENTRY_DESCRIPTION: "వివరణ (ఉదా. శ్రమ, విత్తన విక్రయం)", ENTRY_TYPE: "రకం", INCOME: "ఆదాయం", EXPENSE: "ఖర్చు", LOG_BUTTON: "ఎంట్రీ లాగ్ చేయండి", NET_CASH_FLOW: "నికర నగదు ప్రవాహం:", TOTAL_INCOME: "మొత్తం ఆదాయం:", TOTAL_EXPENSES: "మొత్తం ఖర్చులు:",

// --- LOAN/SUBSIDY KEYS ---

LOAN_SUBSIDY_HUB: "రుణం & సబ్సిడీ హబ్ 🏦", ACTIVE_LOAN: "యాక్టివ్ లోన్:", SCHEME_KCC: "కిసాన్ క్రెడిట్ కార్డ్ (KCC)", LOAN_AMOUNT: "రుణ మొత్తం:", NEXT_REPAYMENT: "తదుపరి తిరిగి చెల్లింపు గడువు:", REPAYMENT_ALERT: "తిరిగి చెల్లింపు హెచ్చరిక!", SUBSIDY_STATUS: "సబ్సిడీ స్థితి:", PM_KISAN: "పీఎం-కిసాన్ (వార్షిక)", STATUS_APPROVED: "ఆమోదించబడింది", STATUS_PENDING: "పెండింగ్‌లో ఉంది", CHECK_STATUS: "స్థితిని తనిఖీ చేయండి",

ADD_LOAN: "+ కొత్త రుణాన్ని/సబ్సిడీని జోడించండి", LOAN_NAME: "రుణం పేరు/పథకం:", LOAN_REPAYMENT_DATE: "తిరిగి చెల్లింపు తేదీ (YYYY-MM-DD):", SUBSIDY_NAME: "సబ్సిడీ పేరు:", SUBMIT_LOAN: "వివరాలను సేవ్ చేయండి",

GOVT_SCHEMES: "ప్రభుత్వ పథకాల పోర్టల్ 📢", SCHEME_BENEFIT: "ప్రయోజనం:", SCHEME_ELIGIBILITY: "అర్హత:", SCHEME_APPLY: "ఇప్పుడే దరఖాస్తు చేయండి",

AI_SELLING_ADVISOR: "AI అమ్మకపు సలహాదారు 💡", ADVISOR_PROMPT: "అమ్మడానికి ఉత్తమ సమయం మరియు స్థలాన్ని పొందడానికి ఒక పంటను ఎంచుకోండి.", ADVISOR_REC_HEADER: "సరైన అమ్మకపు సిఫార్సు:", NET_PROFIT: "నికర లాభం మార్జిన్:", TRANSPORT_COST: "ఉజ్జాయింపు రవాణా ఖర్చు:", SELLING_TIME: "అమ్మడానికి ఉత్తమ సమయం:", SELL_NOW: "ఇప్పుడే అమ్మండి (ధర స్థిరంగా ఉంది)", SELL_LATER: "3 రోజులు వేచి ఉండండి (ధర పెరుగుతుంది)", ADVISOR_MARKET_INTELLIGENCE: "మార్కెట్ ఇంటెలిజెన్స్",

ADVISOR_DISTANCE: "దూరం (కిమీ):", ADVISOR_TRANSPORT: "రవాణా ఖర్చు:", ADVISOR_LOCATION: "వ్యవసాయ క్షేత్రం స్థానం:",

// --- NEW FINANCE DASHBOARD KEYS ---

DASHBOARD_SUMMARY: "ఆర్థిక వివరణ", EXPENSE_BREAKDOWN: "ఖర్చు బ్రేక్‌డౌన్", INCOME_BREAKDOWN: "ఆదాయ వనరుల బ్రేక్‌డౌన్", UPLOAD_BILL: "రసీదు అప్‌లోడ్ 🧾", TRANSACTION_RECORD: "లావాదేవీల చరిత్ర",

CAT_LABOR: "శ్రమ", CAT_FERTILIZER: "ఎరువు", CAT_PESTICIDE: "పురుగుమందు", CAT_STORAGE: "నిల్వ", CAT_MACHINERY: "యంత్రాలు/మరమ్మతు", CAT_OTHER: "ఇతర",

// --- INCOME CATEGORIES ---

INC_CROP: "పంట విక్రయాలు (వరి)", INC_LIVESTOCK: "పశుధనం/డైరీ", INC_SUPPORT: "ప్రభుత్వ మద్దతు/DBT", INC_OTHER: "ఇతర ఆదాయం",

// --- STATEMENTS TAB KEYS ---

PL_SUMMARY: "లాభం & నష్టం ప్రకటన (వార్షిక)", LOAN_SCHEDULE_HEADER: "రుణ తిరిగి చెల్లింపు షెడ్యూల్",

GROSS_REVENUE: "స్థూల ఆదాయం", COGS: "అమ్మిన వస్తువుల ధర", GROSS_PROFIT: "స్థూల లాభం", OP_EXPENSE: "నిర్వహణ ఖర్చు", NET_PROFIT: "నికర లాభం",

LOAN_NAME_SCH: "రుణం పేరు/పథకం", AMOUNT_DUE: "చెల్లించవలసిన మొత్తం", DUE_DATE: "గడువు తేదీ",

// --- TAX & SAVINGS KEYS ---

TAX_SAVINGS_HUB: "పన్ను & పొదుపు హబ్ 💼", TAX_DOCUMENTS: "పన్ను డాక్యుమెంట్ అప్‌లోడ్", TAX_ADVICE: "పన్ను ఆదా సలహా:", INV_ADVICE: "పెట్టుబడి సిఫార్సు:", UPLOAD_DOCS: "పన్ను డాక్యుమెంట్‌లను అప్‌లోడ్ చేయండి", INV_AMOUNT: "లక్ష్య నెలవారీ పెట్టుబడి:",

},

ta: {

HEADER: "அக்ரிகோச்", FINANCIAL_ASSISTANT: "நிதி உதவியாளர் (AI)", FINANCIAL_PROMPT: "கடன், மானியம், காப்பீடு பற்றி கேளுங்கள்.", ASK_AI_BUTTON: "AMAZON BEDROCK AI AGENT", AI_RESPONSE_HEADER: "AI பதில்:", MARKET_INTELLIGENCE: "சந்தை நுண்ணறிவு",

PROMPT_CROP_SELECTION: "1. ஒரு பயிரை தேர்வு செய்யவும்:", BEST_MANDI_HEADER: "🏆 விற்க சிறந்த மார்க்கெட்:", PRICES_TRENDS: "விலை மற்றும் போக்குகள் ", SELECT_NEW_CROP: "<< புதிய பயிரைத் தேர்வு செய்க", PNL_ANALYSIS: "லாபம் மற்றும் இழப்பு பகுப்பாய்வு",

PROMPT_PNL_SELECTION: "P&L க்காக ஒரு பயிரைத் தேர்வு செய்யவும்:", PNL_ADVICE_NO_INPUT: "விரிவான P&L பகுப்பாய்வைக் காண, ஒரு பயிர் பொத்தானைத் தட்டவும்.", DEMAND_FORECAST: "தேவை முன்னறிவிப்பு (அடுத்த பருவம்)",

PROMPT_REGION_SELECTION: "உங்கள் அடுத்த சுழற்சியைத் திட்டமிட உங்கள் பகுதியைத் தேர்வு செய்யவும்:", FORECAST_FOR: "க்கான முன்னறிவிப்பு", PRIMARY_REC: "🥇 முதன்மை பரிந்துரை:", SECONDARY_OPTIONS: "இரண்டாம் நிலை விருப்பங்கள்:", SELECT_NEW_REGION: "<< புதிய பகுதியைத் தேர்வு செய்க", WEATHER_FORECAST: "வானிலை முன்னறிவிப்பு 🌦️",

WEATHER_PROMPT: "வானிலைக்காக பகுதியை தேர்வு செய்க:", WEATHER_IN: "இல் வானிலை", NO_DATA: "தொடங்க ஒரு பயிரைத் தேர்வு செய்யவும்.", CLOSE_ANALYSIS: "பகுப்பாய்வை மூடு", COST: "செலவு", REVENUE: "வருவாய்", NET_IMPACT_SCORE: "நிகர தாக்க மதிப்பெண்:", ADVICE: "ஆலோசனை:",

FACTOR: "காரணி", IMPACT: "தாக்கம்", REASON: "காரணம்", TAP_TO_LEARN: "[கற்றுக்கொள்ள தட்டவும்]", AI_INSIGHT: "AI நுண்ணறிவு",

PNL_YIELD: "எதிர்பார்க்கும் விளைச்சல் (கிலோ):", PNL_PRICE: "எதிர்பார்க்கும் விலை (₹/கிலோ):", PNL_FERTILIZER: "உரச் செலவு (₹):", PNL_PESTICIDE: "பூச்சிக்கொல்லி செலவு (₹):", PNL_LABOUR: "தொழிலாளர் செலவு (₹):", PNL_OTHER: "பிற செலவுகள் (₹):",

CROP_Tomato: "தக்காளி", CROP_Onion: "வெங்காயம்", CROP_Wheat: "கோதுமை", CROP_Rice: "அரிசி", CROP_Chilli: "மிளகாய்", CROP_Cotton: "பருத்தி", CROP_Potato: "உருளைக்கிழங்கு", CROP_Maize: "மக்காச்சோளம்", CROP_Mustard: "கடுகு", CROP_Soybean: "சோயாபீன்", CROP_Coffee: "காபி", CROP_Sugarcane: "கரும்பு",

STATUS_DEFAULT: "தொடங்க ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்.", STATUS_FETCHING_WEATHER: (mandi) => `${mandi} க்கான வானிலை தரவைப் பெறுகிறது...`, STATUS_WEATHER_UPDATED: "வானிலை புதுப்பிக்கப்பட்டது.", STATUS_WEATHER_FAILED: "வானிலை தரவைப் பெற முடியவில்லை。", STATUS_FETCHING_FORECAST: (mandi) => `${mandi} க்கான தரவைப் பெறுகிறது...`,

STATUS_FORECAST_READY: (mandi) => `${mandi} க்கான தரவு தயார்!`, STATUS_SELECTED_CROP: (crop) => `${TRANSLATIONS.ta['CROP_' + crop]} தேர்ந்தெடுக்கப்பட்டது. இப்போது விலைகளைப் பெறுகிறது...`, STATUS_FETCHING_PRICES: (crop) => `${TRANSLATIONS.ta['CROP_' + crop]} க்கான விலைகளைப் பெறுகிறது...`, STATUS_PRICES_FETCHED: (crop) => `${TRANSLATIONS.ta['CROP_' + crop]} க்கான தரவு பெறப்பட்டது!`,

STATUS_ERROR_PRICES: "விலைகளைப் பெறுவதில் பிழை. சர்வரைச் சரிபார்க்கவும்。", STATUS_INPUT_REQUIRED: "AIயிடம் கேட்பதற்கு முன் ஒரு கேள்வியைத் தட்டச்சு செய்யவும்。", STATUS_ASKING_AI: "AI உதவியாளரிடம் கேட்கிறது...", STATUS_AI_RESPONDED: "AI பதிலளித்துள்ளது。", STATUS_AI_ERROR: "AI உதவியாளருடன் இணைப்பதில் பிழை。",

STATUS_FETCHING_PNL: (crop) => `${TRANSLATIONS.ta['CROP_' + crop]} க்கான P&L பகுப்பாய்வைப் பெறுகிறது...`, STATUS_ERROR_PNL: "P&L பகுப்பாய்வு தரவைப் பெற முடியவில்லை。",

TAB_HOME: "முகப்பு", TAB_MARKET: "மார்க்கெட்", TAB_PLANNING: "திட்டமிடல்", TAB_FINANCE: "நிதி", TAB_STATEMENTS: "அறிக்கைகள்", TAB_TAX: "வரி மற்றும் சேமிப்பு", TAB_ADVISOR: "ஆலோசகர்", TAB_WEATHER: "வானிலை",

CROP_HEALTH_ANALYST: "பயிர் சுகாதார பகுப்பாய்வு 📸", PEST_DIAGNOSIS_PROMPT: "உடனடி நோயறிதலுக்கு இலையின் புகைப்படத்தை பதிவேற்றவும்.", UPLOAD_PHOTO: "புகைப்படத்தைப் பதிவேற்றவும்", DIAGNOSIS_RESULT: "நோயறிதல்:", NO_DIAGNOSIS: "எந்த சிக்கலும் கண்டறியப்படவில்லை.",

INPUT_OPTIMIZER: "உள்ளீட்டுச் செலவு உகப்பாக்கி", OPTIMIZER_ADVICE: "உகப்பாக்கி ஆலோசனை:", IRRIGATION_SCHEDULER: "ஸ்மார்ட் நீர்ப்பாசன திட்டமிடுபவர் 💧", IRRIGATION_SCHEDULE: "{crop} க்கான நீர்ப்பாசன அட்டவணை:", NEXT_WATERING: "அடுத்த நீர்ப்பாசனம்:", WATER_AMOUNT: "நீரின் அளவு:", IRRIGATION_ADVICE: "ஆலோசனை:", EXTENDED_FORECAST: "விரிவான 15-நாள் அவுட்லுக்",

DASHBOARD_TITLE: "விவசாயிக்கு வரவேற்கிறோம்! ஒரு சேவையைத் தேர்ந்தெடுக்கவும்:", DASHBOARD_MARKET_DESC: "விலைகள், விற்பனை ஆலோசனை, P&L பகுப்பாய்வு.", DASHBOARD_PLANNING_DESC: "பயிர் தேவை, விளைச்சல் திட்டமிடல், நீர்ப்பாசனம்.", DASHBOARD_FINANCE_DESC: "கடன், மானியங்கள் & பணப்புழக்க கண்காணிப்பு.", DASHBOARD_WEATHER_DESC: "தற்போதைய மற்றும் நீட்டிக்கப்பட்ட வானிலை முன்னறிவிப்பு.",

SOIL_NUTRITION: "மண் & ஊட்டச்சத்து மேலாண்மை 🧪", FERTILIZER_SUGGESTION: "உர பரிந்துரை:", GET_FERTILIZER: "பரிந்துரையைப் பெறவும்", SOIL_TYPE: "மண் வகை:", SOIL_TREATMENT: "சிகிச்சை:", NPK_SUGGESTION: "NPK (கிலோ/ஹெக்டேர்):", MICRO_NUTRIENTS: "நுண்ணூட்டச்சத்துக்கள்:",

CASH_FLOW_TRACKER: "பணப்புழக்க கண்காணிப்பான் 💵", LOG_NEW_ENTRY: "புதிய பரிவர்த்தனையை பதிவு செய்யவும்", ENTRY_DESCRIPTION: "விளக்கம் (எ.கா. தொழிலாளர், விதை விற்பனை)", ENTRY_TYPE: "வகை", INCOME: "வருமானம்", EXPENSE: "செலவு", LOG_BUTTON: "பதிவு செய்யவும்", NET_CASH_FLOW: "நிகர பணப்புழக்கம்:", TOTAL_INCOME: "மொத்த வருமானம்:", TOTAL_EXPENSES: "மொத்த செலவுகள்:",

// --- LOAN/SUBSIDY KEYS ---

LOAN_SUBSIDY_HUB: "கடன் மற்றும் மானிய மையம் 🏦", ACTIVE_LOAN: "செயலில் உள்ள கடன்:", SCHEME_KCC: "கிசான் கடன் அட்டை (KCC)", LOAN_AMOUNT: "கடன் தொகை:", NEXT_REPAYMENT: "அடுத்த தவணை தேதி:", REPAYMENT_ALERT: "தவணை எச்சரிக்கை!", SUBSIDY_STATUS: "மானியம் நிலை:", PM_KISAN: "PM-KISAN (ஆண்டு)", STATUS_APPROVED: "அங்கீகரிக்கப்பட்டது", STATUS_PENDING: "நிலுவையில் உள்ளது", CHECK_STATUS: "நிலையைச் சரிபார்க்கவும்",

ADD_LOAN: "+ புதிய கடனை/மானியத்தை சேர்க்கவும்", LOAN_NAME: "கடன் பெயர்/திட்டம்:", LOAN_REPAYMENT_DATE: "திருப்பிச் செலுத்தும் தேதி (YYYY-MM-DD):", SUBSIDY_NAME: "மானியத்தின் பெயர்:", SUBMIT_LOAN: "விவரங்களைச் சேமிக்கவும்",

GOVT_SCHEMES: "அரசு திட்டங்கள் போர்ட்டல் 📢", SCHEME_BENEFIT: "பலன்:", SCHEME_ELIGIBILITY: "தகுதி:", SCHEME_APPLY: "இப்போது விண்ணப்பிக்கவும்",

AI_SELLING_ADVISOR: "AI விற்பனை ஆலோசகர் 💡", ADVISOR_PROMPT: "விற்பனை செய்ய சிறந்த நேரம் மற்றும் இடத்தைப் பெற ஒரு பயிரைத் தேர்ந்தெடுக்கவும்.", ADVISOR_REC_HEADER: "உகந்த விற்பனை பரிந்துரை:", NET_PROFIT: "நிகர இலாப வரம்பு:", TRANSPORT_COST: "மதிப்பீட்டு போக்குவரத்து செலவு:", SELLING_TIME: "விற்பனை செய்ய சிறந்த நேரம்:", SELL_NOW: "இப்போது விற்கவும் (விலை நிலையானது)", SELL_LATER: "3 நாட்கள் காத்திருக்கவும் (விலை உயரும்)", ADVISOR_MARKET_INTELLIGENCE: "சந்தை நுண்ணறிவு",

ADVISOR_DISTANCE: "தூரம் (கிமீ):", ADVISOR_TRANSPORT: "போக்குவரத்து செலவு:", ADVISOR_LOCATION: "விவசாயப் பண்ணை இடம்:",

// --- NEW FINANCE DASHBOARD KEYS ---

DASHBOARD_SUMMARY: "நிதி கண்ணோட்டம்", EXPENSE_BREAKDOWN: "செலவு விவரங்கள்", INCOME_BREAKDOWN: "வருமான ஆதார விவரங்கள்", UPLOAD_BILL: "ரசீது பதிவேற்றம் 🧾", TRANSACTION_RECORD: "பரிவர்த்தனை பதிவு",

CAT_LABOR: "தொழிலாளர்", CAT_FERTILIZER: "உரம்", CAT_PESTICIDE: "பூச்சிக்கொல்லி", CAT_STORAGE: "சேமிப்பு", CAT_MACHINERY: "இயந்திரங்கள்/பழுது", CAT_OTHER: "மற்றவை",

// --- INCOME CATEGORIES ---

INC_CROP: "பயிர் விற்பனை (தக்காளி)", INC_LIVESTOCK: "கால்நடை/பால்பண்ணை", INC_SUPPORT: "அரசு ஆதரவு/DBT", INC_OTHER: "மற்ற வருமானம்",

// --- STATEMENTS TAB KEYS ---

PL_SUMMARY: "லாபம் மற்றும் நஷ்ட அறிக்கை (ஆண்டு)", LOAN_SCHEDULE_HEADER: "கடன் திருப்பிச் செலுத்தும் அட்டவணை",

GROSS_REVENUE: "மொத்த வருவாய்", COGS: "விற்கப்பட்ட பொருட்களின் விலை", GROSS_PROFIT: "மொத்த லாபம்", OP_EXPENSE: "இயக்கச் செலவு", NET_PROFIT: "நிகர லாபம்",

LOAN_NAME_SCH: "கடன் பெயர்/திட்டம்", AMOUNT_DUE: "செலுத்த வேண்டிய தொகை", DUE_DATE: "கடைசி தேதி",

// --- TAX & SAVINGS KEYS ---

TAX_SAVINGS_HUB: "வரி மற்றும் சேமிப்பு மையம் 💼", TAX_DOCUMENTS: "வரி ஆவணம் பதிவேற்றம்", TAX_ADVICE: "வரி சேமிப்பு ஆலோசனை:", INV_ADVICE: "முதலீட்டு பரிந்துரை:", UPLOAD_DOCS: "வரி ஆவணங்களைப் பதிவேற்றவும்", INV_AMOUNT: "இலக்கு மாதாந்திர முதலீடு:",

},

ml: {

HEADER: "അഗ്രികോച്ച്", FINANCIAL_ASSISTANT: "സാമ്പത്തിക സഹായി (AI)", FINANCIAL_PROMPT: "വായ്പ, സബ്സിഡികൾ മുതലായവയെക്കുറിച്ച് ചോദിക്കുക。", ASK_AI_BUTTON: "AMAZON BEDROCK AI AGENT", AI_RESPONSE_HEADER: "AI പ്രതികരണം:", MARKET_INTELLIGENCE: "മാർക്കറ്റ് ഇൻ്റലിജൻസ്",

PROMPT_CROP_SELECTION: "1. ഒരു വിള തിരഞ്ഞെടുക്കുക:", BEST_MANDI_HEADER: "🏆 വിൽക്കാൻ പറ്റിയ മാൻഡി:", PRICES_TRENDS: "വിലകളും പ്രവണതകളും ", SELECT_NEW_CROP: "<< പുതിയ വിള തിരഞ്ഞെടുക്കുക", PNL_ANALYSIS: "ലാഭനഷ്ട വിശകലനം",

PROMPT_PNL_SELECTION: "P&L വിശകലനത്തിനായി വിള തിരഞ്ഞെടുക്കുക:", PNL_ADVICE_NO_INPUT: "വിശദമായ P&L വിശകലനത്തിനായി ഒരു വിള ബട്ടൺ ടാപ്പ് ചെയ്യുക。", DEMAND_FORECAST: "ഡിമാൻഡ് പ്രവചനം (അടുത്ത സീസൺ)",

PROMPT_REGION_SELECTION: "നിങ്ങളുടെ അടുത്ത സൈക്കിൾ പ്ലാൻ ചെയ്യാൻ പ്രദേശം തിരഞ്ഞെടുക്കുക:", FORECAST_FOR: "എന്നതിനായുള്ള പ്രവചനം", PRIMARY_REC: "🥇 പ്രാഥമിക ശുപാർശ:", SECONDARY_OPTIONS: "ദ്വിതീയ ഓപ്ഷനുകൾ:", SELECT_NEW_REGION: "<< പുതിയ പ്രദേശം തിരഞ്ഞെടുക്കുക", WEATHER_FORECAST: "കാലാവസ്ഥാ പ്രവചനം 🌦️",

WEATHER_PROMPT: "കാലാവസ്ഥയ്ക്കായി പ്രദേശം തിരഞ്ഞെടുക്കുക:", WEATHER_IN: "യിൽ കാലാവസ്ഥ", NO_DATA: "തുടങ്ങാൻ ഒരു വിള തിരഞ്ഞെടുക്കുക。", CLOSE_ANALYSIS: "വിശകലനം അടയ്ക്കുക", COST: "ചെലവ്", REVENUE: "വരുമാനം", NET_IMPACT_SCORE: "നെറ്റ് ഇംപാക്ട് സ്കോർ:", ADVICE: "ഉപദേശം:",

FACTOR: "ഘടകം", IMPACT: "സ്വാധീനം", REASON: "കാരണം", TAP_TO_LEARN: "[പഠിക്കാൻ ടാപ്പ് ചെയ്യുക]", AI_INSIGHT: "AI ഉൾക്കാഴ്ച",

PNL_YIELD: "പ്രതീക്ഷിക്കുന്ന വിളവ് (കിലോ):", PNL_PRICE: "പ്രതീക്ഷിക്കുന്ന വില (₹/കിലോ):", PNL_FERTILIZER: "വളം ചെലവ് (₹):", PNL_PESTICIDE: "കീടനാശിനി ചെലവ് (₹):", PNL_LABOUR: "ലേബർ ചെലവ് (₹):", PNL_OTHER: "മറ്റ് ചെലവുകൾ (₹):",

CROP_Tomato: "തക്കാളി", CROP_Onion: "ഉള്ളി", CROP_Wheat: "ഗോതമ്പ്", CROP_Rice: "അരി", CROP_Chilli: "മുളക്", CROP_Cotton: "പരുത്തി", CROP_Potato: "ഉരുളക്കിഴങ്ങ്", CROP_Maize: "ചോളം", CROP_Mustard: "കടുക്", CROP_Soybean: "സോയാബീൻ", CROP_Coffee: "കാപ്പി", CROP_Sugarcane: "കരിമ്പ്",

STATUS_DEFAULT: "ആരംഭിക്കാൻ ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക。", STATUS_FETCHING_WEATHER: (mandi) => `${mandi} നുള്ള കാലാവസ്ഥാ ഡാറ്റ എടുക്കുന്നു...`, STATUS_WEATHER_UPDATED: "കാലാവസ്ഥ അപ്ഡേറ്റ് ചെയ്തു。", STATUS_WEATHER_FAILED: "കാലാവസ്ഥാ ഡാറ്റ എടുക്കാൻ കഴിഞ്ഞില്ല。", STATUS_FETCHING_FORECAST: (mandi) => `${mandi} നുള്ള ഡാറ്റ എടുക്കുന്നു...`,

STATUS_FORECAST_READY: (mandi) => `${mandi} നുള്ള ഡാറ്റ തയ്യാറാണ്!`, STATUS_SELECTED_CROP: (crop) => `${TRANSLATIONS.ml['CROP_' + crop]} തിരഞ്ഞെടുത്തിരിക്കുന്നു。 ഇപ്പോൾ വിലകൾ എടുക്കുന്നു...`, STATUS_FETCHING_PRICES: (crop) => `${TRANSLATIONS.ml['CROP_' + crop]} നുള്ള വിലകൾ എടുക്കുന്നു...`, STATUS_PRICES_FETCHED: (crop) => `${TRANSLATIONS.ml['CROP_' + crop]} നുള്ള ഡാറ്റ ലഭിച്ചു!`,

STATUS_ERROR_PRICES: "വിലകൾ എടുക്കുന്നതിൽ പിശക്。 സെർവർ പരിശോധിക്കുക。", STATUS_INPUT_REQUIRED: "AI യോട് ചോദിക്കുന്നതിനു മുമ്പ് ദയവായി ഒരു ചോദ്യം ടൈപ്പ് ചെയ്യുക。", STATUS_ASKING_AI: "AI സഹായിയോട് ചോദിക്കുന്നു...", STATUS_AI_RESPONDED: "AI പ്രതികരിച്ചിരിക്കുന്നു。", STATUS_AI_ERROR: "AI സഹായിയിലേക്ക് കണക്റ്റുചെയ്യുന്നതിൽ പിശക്。",

STATUS_FETCHING_PNL: (crop) => `${TRANSLATIONS.ml['CROP_' + crop]} നുള്ള P&L വിശകലനം എടുക്കുന്നു...`, STATUS_ERROR_PNL: "P&L വിശകലന ഡാറ്റ എടുക്കാൻ കഴിഞ്ഞില്ല。",

TAB_HOME: "ഹോം", TAB_MARKET: "മാർക്കറ്റ്", TAB_PLANNING: "പ്ലാനിംഗ്", TAB_FINANCE: "ധനകാര്യം", TAB_STATEMENTS: "പ്രസ്താവനകൾ", TAB_TAX: "നികുതിയും സമ്പാദ്യവും", TAB_ADVISOR: "ഉപദേഷ്ടാവ്", TAB_WEATHER: "കാലാവസ്ഥ",

CROP_HEALTH_ANALYST: "വിള ആരോഗ്യ വിശകലനം 📸", PEST_DIAGNOSIS_PROMPT: "തൽക്ഷണ രോഗനിർണയത്തിനായി ഇലയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക。", UPLOAD_PHOTO: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", DIAGNOSIS_RESULT: "രോഗനിർണയം:", NO_DIAGNOSIS: "പ്രശ്നമൊന്നും കണ്ടെത്തിയില്ല。",

INPUT_OPTIMIZER: "ഇൻപുട്ട് കോസ്റ്റ് ഒപ്റ്റിമൈസർ", OPTIMIZER_ADVICE: "ഒപ്റ്റിമൈസർ ഉപദേശം:", IRRIGATION_SCHEDULER: "സ്മാർട്ട് ജലസേചന ഷെഡ്യൂളർ 💧", IRRIGATION_SCHEDULE: "{crop} നുള്ള ജലസേചന ഷെഡ്യൂൾ:", NEXT_WATERING: "അടുത്ത ജലസേചനം:", WATER_AMOUNT: "ജലത്തിൻ്റെ അളവ്:", IRRIGATION_ADVICE: "ഉപദേശം:", EXTENDED_FORECAST: "വിപുലീകരിച്ച 15-ദിവസത്തെ കാഴ്ച",

DASHBOARD_TITLE: "സ്വാഗതം കർഷകനേ! ഒരു സേവനം തിരഞ്ഞെടുക്കുക:", DASHBOARD_MARKET_DESC: "വിലകൾ, വിൽപ്പന ഉപദേശം, P&L വിശകലനം.", DASHBOARD_PLANNING_DESC: "വിള ഡിമാൻഡ്, വിളവ് ആസൂത്രണം, ജലസേചനം.", DASHBOARD_FINANCE_DESC: "വായ്പ, സബ്സിഡികൾ & പണമിടപാട് ട്രാക്കിംഗ്.", DASHBOARD_WEATHER_DESC: "നിലവിലുള്ളതും വിപുലീകരിച്ചതുമായ കാലാവസ്ഥാ പ്രവചനം.",

SOIL_NUTRITION: "മണ്ണ് & പോഷകാഹാര മാനേജ്മെൻ്റ് 🧪", FERTILIZER_SUGGESTION: "വളം ശുപാർശ:", GET_FERTILIZER: "ശുപാർശ നേടുക", SOIL_TYPE: "മണ്ണിൻ്റെ തരം:", SOIL_TREATMENT: "ചികിത്സ:", NPK_SUGGESTION: "NPK (Kg/ഹെക്ടറിന്):", MICRO_NUTRIENTS: "സൂക്ഷ്മ പോഷകങ്ങൾ:",

CASH_FLOW_TRACKER: "പണമിടപാട് ട്രാക്കർ 💵", LOG_NEW_ENTRY: "പുതിയ ഇടപാട് രേഖപ്പെടുത്തുക", ENTRY_DESCRIPTION: "വിവരണം (ഉദാ. ലേബർ, വിത്ത് വിൽപ്പന)", ENTRY_TYPE: "തരം", INCOME: "വരുമാനം", EXPENSE: "ചെലവ്", LOG_BUTTON: "രേഖപ്പെടുത്തുക", NET_CASH_FLOW: "അറ്റ പണമിടപാട്:", TOTAL_INCOME: "ആകെ വരുമാനം:", TOTAL_EXPENSES: "ആകെ ചെലവ്:",

// --- LOAN/SUBSIDY KEYS ---

LOAN_SUBSIDY_HUB: "വായ്പയും സബ്സിഡി ഹബ്ബും 🏦", ACTIVE_LOAN: "സജീവ വായ്പ:", SCHEME_KCC: "കിസാൻ ക്രെഡിറ്റ് കാർഡ് (KCC)", LOAN_AMOUNT: "വായ്പ തുക:", NEXT_REPAYMENT: "അടുത്ത തിരിച്ചടവ് തീയതി:", REPAYMENT_ALERT: "തിരിച്ചടവ് അലേർട്ട്!", SUBSIDY_STATUS: "സബ്സിഡി നില:", PM_KISAN: "പിഎം-കിസാൻ (വാർഷികം)", STATUS_APPROVED: "അംഗീകരിച്ചു", STATUS_PENDING: "തീർപ്പാക്കാത്തത്", CHECK_STATUS: "നില പരിശോധിക്കുക",

ADD_LOAN: "+ പുതിയ വായ്പ/സബ്സിഡി ചേർക്കുക", LOAN_NAME: "വായ്പയുടെ പേര്/പദ്ധതി:", LOAN_REPAYMENT_DATE: "തിരിച്ചടവ് തീയതി (YYYY-MM-DD):", SUBSIDY_NAME: "സബ്സിഡിയുടെ പേര്:", SUBMIT_LOAN: "വിശദാംശങ്ങൾ സംരക്ഷിക്കുക",

GOVT_SCHEMES: "സർക്കാർ പദ്ധതി പോർട്ടൽ 📢", SCHEME_BENEFIT: "പ്രയോജനം:", SCHEME_ELIGIBILITY: "യോഗ്യത:", SCHEME_APPLY: "ഇപ്പോൾ അപേക്ഷിക്കുക",

AI_SELLING_ADVISOR: "AI വിൽപ്പന ഉപദേഷ്ടാവ് 💡", ADVISOR_PROMPT: "വിൽക്കാൻ ഏറ്റവും അനുയോജ്യമായ സമയവും സ്ഥലവും തിരഞ്ഞെടുക്കുക。", ADVISOR_REC_HEADER: "മികച്ച വിൽപ്പന ശുപാർശ:", NET_PROFIT: "അറ്റ ലാഭ മാർജിൻ:", TRANSPORT_COST: "ഏകദേശ ഗതാഗത ചെലവ്:", SELLING_TIME: "വിൽക്കാൻ ഏറ്റവും നല്ല സമയം:", SELL_NOW: "ഇപ്പോൾ വിൽക്കുക (വില സ്ഥിരമാണ്)", SELL_LATER: "3 ദിവസം കാത്തിരിക്കുക (വില ഉയരും)", ADVISOR_MARKET_INTELLIGENCE: "മാർക്കറ്റ് ഇൻ്റലിജൻസ്",

ADVISOR_DISTANCE: "ദൂരം (കിമീ):", ADVISOR_TRANSPORT: "ഗതാഗത ചെലവ്:", ADVISOR_LOCATION: "ഫാം സ്ഥലം:",

// --- NEW FINANCE DASHBOARD KEYS ---

DASHBOARD_SUMMARY: "സാമ്പത്തിക അവലോകനം", EXPENSE_BREAKDOWN: "ചെലവ് വിഭജനം", INCOME_BREAKDOWN: "വരുമാന സ്രോതസ്സ് വിഭജനം", UPLOAD_BILL: "രസീത് അപ്‌ലോഡ് ചെയ്യുക 🧾", TRANSACTION_RECORD: "ഇടപാട് ചരിത്രം",

CAT_LABOR: "തൊഴിൽ", CAT_FERTILIZER: "വളം", CAT_PESTICIDE: "കീടനാശിനി", CAT_STORAGE: "സംഭരണം", CAT_MACHINERY: "യന്ത്രങ്ങൾ/അറ്റകുറ്റപ്പണി", CAT_OTHER: "മറ്റുള്ളവ",

// --- INCOME CATEGORIES ---

INC_CROP: "വിള വിൽപ്പന (ഗോതമ്പ്)", INC_LIVESTOCK: "കന്നുകാലി/ക്ഷീരം", INC_SUPPORT: "സർക്കാർ പിന്തുണ/ഡിബിടി", INC_OTHER: "മറ്റ് വരുമാനം",

// --- STATEMENTS TAB KEYS ---

PL_SUMMARY: "ലാഭനഷ്ട പ്രസ്താവന (വാർഷികം)", LOAN_SCHEDULE_HEADER: "വായ്പാ തിരിച്ചടവ് ഷെഡ്യൂൾ",

GROSS_REVENUE: "മൊത്ത വരുമാനം", COGS: "വിറ്റ സാധനങ്ങളുടെ വില", GROSS_PROFIT: "മൊത്ത ലാഭം", OP_EXPENSE: "പ്രവർത്തന ചെലവ്", NET_PROFIT: "അറ്റ ലാഭം",

LOAN_NAME_SCH: "വായ്പയുടെ പേര്/പദ്ധതി", AMOUNT_DUE: "നൽകാനുള്ള തുക", DUE_DATE: "അടയ്‌ക്കേണ്ട തീയതി",

// --- TAX & SAVINGS KEYS ---

TAX_SAVINGS_HUB: "നികുതിയും സമ്പാദ്യവും ഹബ് 💼", TAX_DOCUMENTS: "നികുതി രേഖ അപ്‌ലോഡ്", TAX_ADVICE: "നികുതി ലാഭിക്കാനുള്ള ഉപദേശം:", INV_ADVICE: "നിക്ഷേപ ശുപാർശ:", UPLOAD_DOCS: "നികുതി രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക", INV_AMOUNT: "ലക്ഷ്യമാക്കിയ പ്രതിമാസ നിക്ഷേപം:",

}

};



// --- GLOBAL UTILITY FUNCTIONS (Localized) ---

const T_HELPER = (currentLanguage, key, param) => {

const translation = TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.en[key];

if (typeof translation === 'function') {

const translatedCrop = TRANSLATIONS[currentLanguage]?.[`CROP_${param}`] || param;

return translation(key.includes('CROP') ? translatedCrop : param);

}

if (key === 'IRRIGATION_SCHEDULE' && param) {

const translatedCrop = T_HELPER(currentLanguage, `CROP_${param}`) || param;

return translation.replace('{crop}', translatedCrop);

}

return translation || key;

};



// --- Loan Entry Modal Component ---

const LoanEntryModal = ({ isVisible, onClose, T, addNewLoan }) => {

const [name, setName] = useState('');

const [amount, setAmount] = useState('');

const [repaymentDate, setRepaymentDate] = useState('');

const [isSubsidy, setIsSubsidy] = useState(false);

const [subsidyName, setSubsidyName] = useState('');



const handleSubmit = () => {

if (!name || (!isSubsidy && (amount && isNaN(parseFloat(amount)))) || (!isSubsidy && !repaymentDate) ) {

Alert.alert(T('STATUS_ERROR_PRICES').split('.')[0] || "Input Error", "Please fill in the name, date, and a valid amount.");

return;

}



const newLoan = {

id: Date.now(),

scheme: name,

loanAmount: isSubsidy ? 0 : parseFloat(amount),

repaymentDate: isSubsidy ? null : repaymentDate,

isSubsidy: isSubsidy,

subsidyStatus: isSubsidy ? T('STATUS_PENDING') : null,

};

addNewLoan(newLoan);

onClose();

setName(''); setAmount(''); setRepaymentDate(''); setIsSubsidy(false); setSubsidyName('');

};



return (

<Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>

<View style={appStyles.modalCenteredView}>

<View style={[appStyles.modalView, { width: screenWidth * 0.95, maxHeight: 600 }]}>

<Text style={appStyles.modalTitle}>{T('ADD_LOAN')}</Text>



<ScrollView>

<TextInput

style={appStyles.input}

placeholder={T('LOAN_NAME')}

placeholderTextColor="#999"

value={name}

onChangeText={setName}

/>


<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>

<TouchableOpacity

onPress={() => setIsSubsidy(false)}

style={[appStyles.logTypeButton, !isSubsidy && appStyles.logTypeButtonActiveIncome, { flex: 1, marginRight: 5 }]}

>

<Text style={appStyles.logTypeButtonText}>Loan</Text>

</TouchableOpacity>

<TouchableOpacity

onPress={() => setIsSubsidy(true)}

style={[appStyles.logTypeButton, isSubsidy && appStyles.logTypeButtonActiveExpense, { flex: 1, marginLeft: 5 }]}

>

<Text style={appStyles.logTypeButtonText}>Subsidy</Text>

</TouchableOpacity>

</View>



{!isSubsidy && (

<>

<TextInput

style={appStyles.input}

placeholder={T('LOAN_AMOUNT')}

placeholderTextColor="#999"

keyboardType="numeric"

value={amount}

onChangeText={setAmount}

/>

<TextInput

style={appStyles.input}

placeholder={T('LOAN_REPAYMENT_DATE')}

placeholderTextColor="#999"

value={repaymentDate}

onChangeText={setRepaymentDate}

/>

</>

)}

{isSubsidy && (

<TextInput

style={appStyles.input}

placeholder={T('SUBSIDY_NAME')}

placeholderTextColor="#999"

value={subsidyName}

onChangeText={setSubsidyName}

/>

)}

</ScrollView>


<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

<Button title={T('CLOSE_ANALYSIS')} onPress={onClose} color="#6c757d" />

<Button title={T('SUBMIT_LOAN')} onPress={handleSubmit} color={ACCENT_COLOR} />

</View>

</View>

</View>

</Modal>

);

};

// --- END Loan Entry Modal ---



// --- Forecast Result Display Component ---

const ForecastResultDisplay = ({ forecastData, onClose, styles, T, T_CROP }) => {

if (!forecastData || !forecastData.recommendations || forecastData.recommendations.length === 0) return null;

const primaryRecommendation = forecastData.recommendations[0];

return (

<View style={[styles.forecastResultContainer, { marginTop: 15 }]}>

<Text style={styles.forecastResultHeader}>{T('FORECAST_FOR')} {forecastData.mandi} ({T('DEMAND_FORECAST').split('(')[1]}</Text>


<View style={styles.forecastPrimaryBox}>

<Text style={styles.forecastPrimaryText}>{T('PRIMARY_REC')}</Text>

<Text style={[styles.forecastPrimaryCrop, { color: ACCENT_COLOR, fontSize: 24 }]}> {T_CROP(primaryRecommendation.crop)}</Text>

</View>


<View style={styles.forecastDetailBox}>

<Text style={styles.forecastScoreText}>

<Text style={{fontWeight: 'bold', color: WARNING_COLOR, fontSize: 18}}>{T('NET_IMPACT_SCORE').split(':')[0]} {primaryRecommendation.score}</Text>

</Text>

<Text style={styles.forecastReasonText}>

<Text style={{fontWeight: 'bold'}}>{T('REASON')}:</Text> {primaryRecommendation.reason}

</Text>

</View>


<View style={styles.forecastDivider} />


<Text style={styles.forecastSecondaryHeader}>{T('SECONDARY_OPTIONS')}</Text>

<View style={styles.forecastDetailBox}>

{forecastData.recommendations.slice(1).map((rec, index) => (

<View key={index} style={styles.forecastSecondaryItem}>

<Text style={styles.forecastSecondaryText}>- {T_CROP(rec.crop)} <Text style={{fontWeight: 'bold', color: WARNING_COLOR}}>(Score: {rec.score})</Text></Text>

</View>

))}

</View>


<Button title={T('SELECT_NEW_REGION')} onPress={onClose} color="#6c757d" />

</View>

);

};



// --- PNL Drill-Down Modal Component (Functional) ---

const PnlDrillDownModal = ({ isVisible, onClose, pnlData, selectedCrop, styles, T, T_CROP }) => {

const handleTapToLearn = (context) => { Alert.alert(T('AI_INSIGHT'), context, [{ text: T('CLOSE_ANALYSIS') }]); };

if (!pnlData) return null;


const pnlChartData = {

labels: pnlData.reasons.map(r => r.factor.split(' ')[0]) || [T('FACTOR'), T('PNL_PRICE'), T('COST'), T('REASON')],

datasets: [{ data: pnlData.reasons.map(r => parseInt(r.impact)) || [10, 5, -5, -10], color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }]

};

const pnlChartConfig = {

backgroundColor: PRIMARY_DARK, backgroundGradientFrom: SECONDARY_CARD, backgroundGradientTo: PRIMARY_DARK, decimalPlaces: 0, color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

propsForDots: { r: "4", strokeWidth: "2", stroke: WARNING_COLOR }, formatYLabel: (y) => (y > 0 ? `+${y}` : y), propsForLabels: { fontSize: 9 },

};



return (

<Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>

<View style={styles.modalCenteredView}>

<View style={styles.modalView}>

<Text style={styles.modalTitle}>{T('PNL_ANALYSIS')} {T_CROP(selectedCrop)}</Text>


<View style={styles.modalMetricRow}>

<Text style={styles.modalMetricBox}>{T('COST')}: {RUPEE_SYMBOL}15,500.00</Text>

<Text style={styles.modalMetricBox}>{T('REVENUE')}: {RUPEE_SYMBOL}25,000.00</Text>

</View>


<LineChart data={pnlChartData} width={screenWidth * 0.8} height={180} chartConfig={pnlChartConfig} style={styles.modalChartStyle} bezier />


<Text style={styles.modalScoreText}> {T('NET_IMPACT_SCORE')} <Text style={{ color: ACCENT_COLOR }}> {pnlData.net_impact_score} </Text> </Text>


<Text style={styles.modalAdviceText}> {T('ADVICE')}: {pnlData.advice} </Text>


<ScrollView style={styles.modalScrollView}>

<View style={styles.modalTableHeader}>

<Text style={[styles.modalHeaderText, { flex: 4 }]}>{T('FACTOR')}</Text>

<Text style={[styles.modalHeaderText, { flex: 2 }]}>{T('IMPACT')}</Text>

<Text style={[styles.modalHeaderText, { flex: 4 }]}>{T('REASON')}</Text>

</View>

{(pnlData.reasons || []).map((item, index) => (

<View key={index} style={styles.modalTableRow}>

<Text style={[styles.modalRowText, { flex: 4 }]}>{item.factor}</Text>

<Text style={[styles.modalRowText, { flex: 2, color: item.impact.includes('+') ? ACCENT_COLOR : WARNING_COLOR }]}>{item.impact}</Text>

<TouchableOpacity style={{ flex: 4 }} onPress={() => handleTapToLearn(item.ai_context)}>

<Text style={styles.modalCommentText}>{item.comment} <Text style={styles.modalTapToLearnText}>{T('TAP_TO_LEARN')}</Text></Text>

</TouchableOpacity>

</View>

))}

</ScrollView>



<Button title={T('CLOSE_ANALYSIS')} onPress={onClose} color={ACCENT_COLOR} />

</View>

</View>

</Modal>

);

};





// --- MAIN APP COMPONENT ---

export default function App() {

const [currentLanguage, setCurrentLanguage] = useState('en');

const T = (key, param) => T_HELPER(currentLanguage, key, param);

const T_CROP = (cropName) => T_HELPER(currentLanguage, `CROP_${cropName}`) || cropName;



const [activeTab, setActiveTab] = useState('Home');


const [stage, setStage] = useState('crop_selection');

const [selectedCrop, setSelectedCrop] = useState('');

const [availableCrops] = useState(['Tomato', 'Onion', 'Wheat', 'Rice', 'Chilli', 'Cotton', 'Coffee', 'Sugarcane', 'Potato', 'Maize', 'Mustard', 'Soybean']);

const [prices, setPrices] = useState([]);

const [question, setQuestion] = useState('');

const [answer, setAnswer] = useState('');

const [status, setStatus] = useState(T('STATUS_DEFAULT'));

const [loading, setLoading] = useState(false);

const [demandForecastData, setDemandForecastData] = useState(null);

const [demandSelectedMandi, setDemandSelectedMandi] = useState(null);

const MANDI_LIST = ["Lucknow (UP)", "Ludhiana (PB)", "Indore (MP)", "Kolkata (WB)", "Guntur (AP)", "Jaipur (RJ)", "Bengaluru (KA)", "Rajkot (GJ)", "Karnal (HR)", "Pune (MH)", "Chennai (TN)"];

const scaleAnim = useRef(new Animated.Value(1)).current;

const [pnlVisible, setPnlVisible] = useState(false);

const [pnlData, setPnlData] = useState(null);

const [weatherData, setWeatherData] = useState(null);

const [weatherSelectedMandi, setWeatherSelectedMandi] = useState("Chennai (TN)");

const [diagnosisResult, setDiagnosisResult] = useState(null);

const [irrigationSchedule, setIrrigationSchedule] = useState(null);

const [fertilizerData, setFertilizerData] = useState(null);


// --- FINANCIAL TRACKING STATES (EXPANDED CATEGORIES) ---

const [logDescription, setLogDescription] = useState('');

const [logAmount, setLogAmount] = useState('');

const [logType, setLogType] = useState('Expense');

const [financialEntries, setFinancialEntries] = useState([

{ type: 'Income', description: 'Wheat Sale (Mandi)', amount: 35000, date: '2025-09-01', category: 'Crop Sales (Wheat)' },

{ type: 'Expense', description: 'DAP Fertilizer', amount: 8000, date: '2025-09-05', category: 'Fertilizer' },

{ type: 'Expense', description: 'Harvest Labor', amount: 15000, date: '2025-09-06', category: 'Labor' },

{ type: 'Expense', description: 'Pesticide (Tractor)', amount: 4000, date: '2025-09-06', category: 'Pesticide' },

{ type: 'Income', description: 'Milk Sale', amount: 12000, date: '2025-09-10', category: 'Livestock/Dairy' },

{ type: 'Income', description: 'PM-KISAN DBT', amount: 6000, date: '2025-09-15', category: 'Govt. Support/DBT' },

{ type: 'Expense', description: 'Tractor Repair', amount: 6500, date: '2025-09-06', category: 'Machinery/Repair' },

{ type: 'Expense', description: 'Cold Storage Rental', amount: 2500, date: '2025-09-06', category: 'Storage' },

]);


// --- LOAN STATE (ARRAY) ---

const [activeLoans, setActiveLoans] = useState([

{ id: 1, scheme: 'Kisan Credit Card (KCC)', loanAmount: 150000, nextRepayment: 15000, repaymentDate: '2025-10-15', isSubsidy: false },

{ id: 2, scheme: 'Tractor Loan', loanAmount: 250000, nextRepayment: 25000, repaymentDate: '2025-12-01', isSubsidy: false },

{ id: 3, scheme: 'PM-KISAN (Annual)', loanAmount: 0, nextRepayment: 0, repaymentDate: null, isSubsidy: true, subsidyStatus: 'Approved' },

]);

const [loanModalVisible, setLoanModalVisible] = useState(false);

// --- END LOAN STATE ---



// --- ADVISOR STATE ---

const [sellingAdvisorData, setSellingAdvisorData] = useState(null);



useEffect(() => {

fetchWeather(weatherSelectedMandi);

}, []);



useEffect(() => {

setStatus(T('STATUS_DEFAULT'));

if (selectedCrop) setStage('crop_selection');

}, [currentLanguage]);



// --- FINANCIAL CALCULATIONS AND HANDLERS ---

const calculateCashFlow = () => {

const income = financialEntries.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);

const expense = financialEntries.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);


const expenseBreakdown = financialEntries

.filter(e => e.type === 'Expense')

.reduce((acc, entry) => {

const category = entry.category || T('CAT_OTHER'); // Use translated category

acc[category] = (acc[category] || 0) + entry.amount;

return acc;

}, {});



// NEW: Income Breakdown

const incomeBreakdown = financialEntries

.filter(e => e.type === 'Income')

.reduce((acc, entry) => {

const category = entry.category || T('INC_OTHER');

acc[category] = (acc[category] || 0) + entry.amount;

return acc;

}, {});



// Format for Pie Charts

const expensePieData = Object.keys(expenseBreakdown).map((category, index) => ({

name: category,

population: expenseBreakdown[category],

color: ['#F0F0F0', '#FF6347', '#4CAF50', '#1E90FF', '#FFA500', '#888888'][index % 6],

legendFontColor: TEXT_COLOR,

legendFontSize: 13,

}));


const incomePieData = Object.keys(incomeBreakdown).map((category, index) => ({

name: category,

population: incomeBreakdown[category],

color: ['#00FFFF', ACCENT_COLOR, '#6A5ACD', '#FFDC00'][index % 4],

legendFontColor: TEXT_COLOR,

legendFontSize: 13,

}));





return { income, expense, net: income - expense, expensePieData, incomePieData };

};



const handleLogEntry = () => {

const amountNum = parseFloat(logAmount);

if (!logDescription || isNaN(amountNum) || amountNum <= 0) {

Alert.alert(T('STATUS_ERROR_PRICES').split('.')[0] || "Error", "Please enter a valid description and amount.");

return;

}


// --- EXPANDED CATEGORIZATION LOGIC ---

let category = T('CAT_OTHER');

const descLower = logDescription.toLowerCase();


if (logType === 'Income') {

if (descLower.includes('sale') || descLower.includes('crop') || descLower.includes('mandi')) category = T('INC_CROP').split('(')[0].trim();

else if (descLower.includes('milk') || descLower.includes('livestock') || descLower.includes('dairy')) category = T('INC_LIVESTOCK');

else if (descLower.includes('pm-kisan') || descLower.includes('dbt') || descLower.includes('subsidy')) category = T('INC_SUPPORT');

else category = T('INC_OTHER');



} else { // Expense

if (descLower.includes('labo')) category = T('CAT_LABOR');

else if (descLower.includes('fertilizer') || descLower.includes('dap') || descLower.includes('urea')) category = T('CAT_FERTILIZER');

else if (descLower.includes('pesticide') || descLower.includes('spray')) category = T('CAT_PESTICIDE');

else if (descLower.includes('repair') || descLower.includes('tractor') || descLower.includes('machin')) category = T('CAT_MACHINERY');

else if (descLower.includes('storage') || descLower.includes('warehouse')) category = T('CAT_STORAGE');

else category = T('CAT_OTHER');

}

// --- END EXPANDED CATEGORIZATION ---





const newEntry = {

type: logType,

description: logDescription,

amount: amountNum,

date: new Date().toISOString().split('T')[0],

category: category,

};

setFinancialEntries(prev => [newEntry, ...prev]);

setLogDescription('');

setLogAmount('');

};


// MOCK OCR Logic

const handleBillUpload = () => {

setLoading(true);

setStatus("Analyzing uploaded receipt via OCR...");

setTimeout(() => {

// Mock OCR result

setLogDescription("Pesticide Purchase: Coromandel");

setLogAmount("1850");

setLogType('Expense');

setStatus(T('STATUS_AI_RESPONDED'));

setLoading(false);

Alert.alert("OCR Success", "Bill details auto-filled. Review and click 'Log Entry'.");

}, 1500);

};


const checkRepaymentDue = (dateString) => {

if (!dateString) return { alert: false, days: Infinity };

const today = new Date();

const repaymentDate = new Date(dateString);

const diffTime = repaymentDate.getTime() - today.getTime();

const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

if (diffDays >= 0 && diffDays <= 7) {

return { alert: true, days: diffDays };

}

return { alert: false, days: diffDays };

};


const addNewLoan = (newLoan) => {

setActiveLoans(prev => [{...newLoan, id: Date.now()}, ...prev]);

};

// --- END FINANCIAL HANDLERS ---





// --- MOCK API FUNCTIONS (Updated) ---

const fetchMockData = (feature, crop) => {

return new Promise(resolve => {

setTimeout(() => {

setLoading(false);

if (feature === 'pnl') {

resolve({

advice: T_HELPER(currentLanguage, 'ADVICE'),

net_impact_score: "+15",

reasons: [

{factor: T_HELPER(currentLanguage, 'FACTOR'), impact: '+10', comment: 'High demand forecast.', ai_context: 'Demand for this crop is expected to increase by 20% next quarter due to export data.'},

{factor: T_HELPER(currentLanguage, 'COST'), impact: '-5', comment: 'Fertilizer prices spiked.', ai_context: 'Di-Ammonium Phosphate (DAP) prices rose unexpectedly last week. Switch to Urea-based mix.'},

{factor: T_HELPER(currentLanguage, 'WEATHER_FORECAST'), impact: '+5', comment: 'Favorable monsoon predicted.', ai_context: 'Regional long-range forecast shows 105% of average rainfall.'}

]

});

} else if (feature === 'irrigation') {

resolve({

nextWatering: "Monday, 14 Oct",

amount: "25 L/sq meter",

advice: T_HELPER(currentLanguage, 'IRRIGATION_ADVICE')

});

} else if (feature === 'fertilizer') {

resolve({

soil_type: 'Alluvial Soil (Loamy)',

soil_treatment: 'Gypsum (50kg/hectare)',

npk_suggestion: '120:60:40 (Urea, DAP, MOP)',

micro_nutrients: 'Zinc Sulphate (25kg/hectare)',

});

} else if (feature === 'extended_weather') {

resolve([

{ day: 'Day 4', temp: '32° / 25°', condition: 'Sunny' },

{ day: 'Day 7', temp: '30° / 24°', condition: 'Light Rain' },

{ day: 'Day 10', temp: '33° / 26°', condition: 'Hot & Dry' },

]);

}

}, 1000);

});

};

// --- END MOCK API FUNCTIONS ---



// --- AI SELLING ADVISOR HANDLER (Dynamic Mock Logic) ---

const generateSellingAdvice = (cropName) => {

setLoading(true);

setSellingAdvisorData(null); // Clear previous data

setStatus(`Generating AI selling advice for ${cropName}...`);


const randomMandi = MANDI_LIST[Math.floor(Math.random() * MANDI_LIST.length)];

const profitMargin = (Math.random() * 10 + 5).toFixed(1); // 5.0% to 15.0%

const sellAction = Math.random() > 0.5 ? T('SELL_NOW') : T('SELL_LATER');

// Calculate dynamic cost and distance

const distance = Math.floor(Math.random() * 300) + 50; // 50km to 350km

const costPerKm = 5; // Mock cost per km

const estCost = (distance * costPerKm).toFixed(0);



setTimeout(() => {

setSellingAdvisorData({

crop: T_CROP(cropName),

mandi: randomMandi.split('(')[0].trim(), // Clean name for display

profit: `+${profitMargin}% (${RUPEE_SYMBOL}4,500 est.)`,

time: sellAction,

cost: `${RUPEE_SYMBOL}${estCost}`,

distance: `${distance} km`,

transport_time: `${Math.floor(distance / 50 + 1)} hrs`

});

setStatus(T('STATUS_AI_RESPONDED'));

setLoading(false);

}, 1500);

};

// --- END AI SELLING ADVISOR HANDLER ---





const fetchWeather = async (mandiName) => {

setStatus(T('STATUS_FETCHING_WEATHER', mandiName));

setWeatherSelectedMandi(mandiName);

try {

const response = await fetch(`${API_URL}/weather-forecast?region=${encodeURIComponent(mandiName)}`);

const data = await response.json();

const extendedForecast = await fetchMockData('extended_weather', mandiName);

setWeatherData({

...data,

forecast: [

{ day: T_HELPER(currentLanguage, 'WEATHER_IN').split(' ')[0] || 'Tomorrow', high_c: '31', low_c: '25', condition: 'Showers' },

{ day: T_HELPER(currentLanguage, 'WEATHER_IN').split(' ')[0] || 'Overmorrow', high_c: '32', low_c: '26', condition: 'Thunderstorms' },

{ day: T_HELPER(currentLanguage, 'WEATHER_IN').split(' ')[0] || 'Next Day', high_c: '32', low_c: '26', condition: 'Rain' },

],

extendedForecast: extendedForecast

});

setStatus(T('STATUS_WEATHER_UPDATED'));

} catch (error) {

setStatus(T('STATUS_WEATHER_FAILED'));

}

};



const resetDemandForecast = () => {

setDemandForecastData(null);

setDemandSelectedMandi(null);

setStatus(T('STATUS_DEFAULT'));

};



const fetchAndDisplayDemandForecast = async (mandiName) => {

setStatus(T('STATUS_FETCHING_FORECAST', mandiName));

setDemandSelectedMandi(mandiName);


const mockDemandData = {

mandi: mandiName,

recommendations: [

{ crop: 'Soybean', score: 95, reason: 'High processing demand and favorable rainfall prediction.' },

{ crop: 'Maize', score: 88, reason: 'Stable global price outlook.' },

{ crop: 'Chilli', score: 75, reason: 'Local demand is strong but pest risk is moderate.' },

]

};



setDemandForecastData(mockDemandData);

setStatus(T('STATUS_FORECAST_READY', mandiName));

};



const fetchPnlAnalysis = async (cropName) => {

setStatus(T('STATUS_FETCHING_PNL', cropName));

setLoading(true);

const data = await fetchMockData('pnl', cropName);

setPnlData({ ...data, selectedCrop: cropName });

setSelectedCrop(cropName);

setLoading(false);

setPnlVisible(true);

};



const fetchPrices = (cropName) => {

setLoading(true);

setSelectedCrop(cropName);

setStatus(T('STATUS_FETCHING_PRICES', cropName));


fetch(`${API_URL}/market-prices/${cropName}`)

.then(response => response.json())

.then(data => { setPrices(data.predictions || []); setStage('final_prices'); setStatus(T('STATUS_PRICES_FETCHED', cropName)); })

.catch(error => { setStatus(T('STATUS_ERROR_PRICES')); })

.finally(() => setLoading(false));

};


const askAI = () => {

if (!question.trim()) {

Alert.alert(T('STATUS_INPUT_REQUIRED').split(':')[0] || "Input Required", T('STATUS_INPUT_REQUIRED').split(':')[1] || "Please type a question.");

return;

}

setLoading(true);

setAnswer('');

setStatus(T('STATUS_ASKING_AI'));

fetch(`${API_URL}/ask-assistant?question=${encodeURIComponent(question)}`)

.then(response => response.json())

.then(data => { setAnswer(data.answer); setStatus(T('STATUS_AI_RESPONDED')); })

.catch(error => { setStatus(T('STATUS_AI_ERROR')); Alert.alert(T('STATUS_AI_ERROR').split(':')[0] || "Connection Error", T('STATUS_AI_ERROR').split(':')[1] || "Check server."); })

.finally(() => { setLoading(false); });

};



const generateIrrigationSchedule = async (cropName) => {

setStatus(`Generating irrigation plan for ${cropName}...`);

setLoading(true);

const data = await fetchMockData('irrigation', cropName);

setIrrigationSchedule({ ...data, crop: cropName });

setStatus(T('STATUS_WEATHER_UPDATED'));

setLoading(false);

};


const generateFertilizerSuggestion = async (cropName) => {

setStatus(`Generating fertilizer recommendations for ${cropName}...`);

setLoading(true);

const data = await fetchMockData('fertilizer', cropName);

setFertilizerData({ ...data, crop: cropName });

setStatus(T('STATUS_WEATHER_UPDATED'));

setLoading(false);

};



const handlePhotoUpload = async () => {

setLoading(true);

setDiagnosisResult(null);

setStatus(T('PEST_DIAGNOSIS_PROMPT'));

setTimeout(() => {

setDiagnosisResult({

disease: "Early Blight (Alternaria Solani)",

impact: "High risk to 40% of yield.",

treatment: "Apply Mancozeb 75WP (2g/L) and prune affected lower leaves immediately."

});

setStatus(T('STATUS_AI_RESPONDED'));

setLoading(false);

}, 3000);

};



const startOver = () => { setStage('crop_selection'); setSelectedCrop(''); setPrices([]); setPnlData(null); setStatus(T('STATUS_DEFAULT')); };


// --- RENDER FUNCTIONS ---


const renderHomeTab = () => {

const homeSections = [

{ key: 'Market', name: T('TAB_MARKET'), color: ACCENT_COLOR, icon: '📈', desc: T('DASHBOARD_MARKET_DESC') },

{ key: 'Planning', name: T('TAB_PLANNING'), color: WARNING_COLOR, icon: '📅', desc: T('DASHBOARD_PLANNING_DESC') },

{ key: 'Finance', name: T('TAB_FINANCE'), color: '#1E90FF', icon: '💰', desc: T('DASHBOARD_FINANCE_DESC') },

{ key: 'Statements', name: T('TAB_STATEMENTS'), color: STATEMENT_COLOR, icon: '📄', desc: T('PL_SUMMARY') + " & " + T('LOAN_SCHEDULE_HEADER') },

{ key: 'Tax', name: T('TAB_TAX'), color: TAX_COLOR, icon: '💼', desc: T('TAX_SAVINGS_HUB') },

{ key: 'Assistant', name: T('TAB_ADVISOR'), color: 'purple', icon: '💡', desc: T('AI_SELLING_ADVISOR').split('💡')[0] + T('CROP_HEALTH_ANALYST').split('📸')[0] },

{ key: 'Weather', name: T('TAB_WEATHER'), color: WEATHER_COLOR, icon: '☀️', desc: T('DASHBOARD_WEATHER_DESC') },

].filter(section => section.key !== 'Schemes'); // Remove old schemes tab if it still exists in mock list


return (

<ScrollView contentContainerStyle={[appStyles.scrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>

<Text style={appStyles.dashboardTitle}>{T('DASHBOARD_TITLE')}</Text>

<View style={appStyles.dashboardGrid}>

{homeSections.map((section) => (

<TouchableOpacity

key={section.key}

style={appStyles.dashboardCardWrapper}

onPress={() => setActiveTab(section.key)}

>

<View style={[appStyles.dashboardCard, { borderColor: section.color }]}>

<Text style={appStyles.dashboardCardIcon}>{section.icon}</Text>

<Text style={[appStyles.dashboardCardTitle, { color: section.color }]}>{section.name}</Text>

<Text style={appStyles.dashboardCardDescription}>{section.desc}</Text>

</View>

</TouchableOpacity>

))}

</View>

</ScrollView>

);

};



const renderMarketTab = () => {

const currentPrices = prices;

const bestMandi = currentPrices.reduce((best, current) => current.price > best.price ? current : best, { price: -1, mandi: 'N/A' });

const chartData = {

labels: currentPrices.map(p => p.mandi.split('(')[0].trim()),

datasets: [{ data: currentPrices.map(p => p.price), color: (opacity = 1) => CROP_COLORS[selectedCrop] || `rgba(40, 167, 69, ${opacity})` }]

};

const chartConfig = {

backgroundGradientFrom: SECONDARY_CARD, backgroundGradientTo: '#3a3a5a', decimalPlaces: 2, color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, style: { borderRadius: 8 },

propsForDots: { r: "4", strokeWidth: "2", stroke: CROP_COLORS[selectedCrop] || ACCENT_COLOR }, propsForLabels: { fontSize: 10 }, yAxisLabel: RUPEE_SYMBOL

};



return (

<ScrollView contentContainerStyle={appStyles.scrollContainer}>

{/* 1. Market Intelligence */}

<View style={[appStyles.section, appStyles.marketSectionBorder]}>

<Text style={appStyles.subHeader}>{T('MARKET_INTELLIGENCE')} ({T_CROP(selectedCrop) || T('TAB_MARKET')})</Text>


<Text style={appStyles.promptWhite}>{T('PROMPT_CROP_SELECTION')}</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={appStyles.horizontalButtonContainer}>

{availableCrops.map(crop => (

<TouchableOpacity key={crop} onPress={() => fetchPrices(crop)}>

<View style={[appStyles.cropButton, { backgroundColor: CROP_COLORS[crop] || '#6c757d' }]}><Text style={appStyles.cropButtonText}>{T_CROP(crop)}</Text></View>

</TouchableOpacity>

))}

</ScrollView>


{loading && activeTab === 'Market' ? <ActivityIndicator size="large" color={ACCENT_COLOR} /> :

(stage === 'final_prices' && currentPrices.length > 0) ? (

<View style={{ marginTop: 10 }}>

<View style={appStyles.recommendationBox}><Text style={appStyles.recommendationHeader}>{T('BEST_MANDI_HEADER')}</Text><Text style={appStyles.recommendationText}>{bestMandi.mandi} at {RUPEE_SYMBOL}{bestMandi.price.toFixed(2)}/kg</Text></View>


<Text style={appStyles.promptPricesWhite}>Price Movement for {T_CROP(selectedCrop)}:</Text>

<LineChart data={chartData} width={screenWidth - 50} height={220} chartConfig={chartConfig} bezier style={appStyles.chartStyle} />


<Text style={appStyles.promptPricesWhite}>{T('PRICES_TRENDS')} {T_CROP(selectedCrop)}:</Text>

<View style={appStyles.priceList}>

{currentPrices.map((price, index) => (

<View key={index} style={appStyles.priceItemRow}>

<Text style={appStyles.cityText}>{price.mandi}</Text>

<View style={appStyles.priceInfoContainer}>

<Text style={[appStyles.priceText, { color: CROP_COLORS[selectedCrop] || ACCENT_COLOR, fontWeight: 'bold' }]}> {RUPEE_SYMBOL}{price.price.toFixed(2)}/kg </Text>

<Text style={[appStyles.trendText, { color: price.trend.includes('Up') ? ACCENT_COLOR : price.trend.includes('Down') ? '#FF6347' : TEXT_COLOR }]}> ({price.trend}) </Text>

</View>

</View>

))}

</View>

<Button title={T('SELECT_NEW_CROP')} onPress={() => startOver()} color="#6c757d" />

</View>

) : <Text style={appStyles.noData}>{T('NO_DATA')}</Text>}

</View>



{/* 2. PNL Analysis / Input Cost Optimizer */}

<View style={[appStyles.section, appStyles.pnlSectionBorder]}>

<Text style={appStyles.subHeader}>{T('PNL_ANALYSIS')} / {T('INPUT_OPTIMIZER')}</Text>


<Text style={appStyles.promptWhite}>{T('PROMPT_PNL_SELECTION')}</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={appStyles.horizontalButtonContainer}>

{availableCrops.map(crop => (

<TouchableOpacity key={`pnl-${crop}`} onPress={() => fetchPnlAnalysis(crop)}>

<View style={[appStyles.cropButton, { backgroundColor: WARNING_COLOR }]}><Text style={appStyles.cropButtonText}>{T_CROP(crop)}</Text></View>

</TouchableOpacity>

))}

</ScrollView>



{pnlData && !pnlVisible && (

<View style={appStyles.optimizerAdviceBox}>

<Text style={appStyles.answerHeader}>{T('OPTIMIZER_ADVICE')}</Text>

<Text style={appStyles.answer}>{pnlData.advice}</Text>

<TouchableOpacity onPress={() => setPnlVisible(true)} style={{ marginTop: 10 }}>

<Text style={{ color: '#00FFFF', fontWeight: 'bold' }}>{T('TAP_TO_LEARN')}</Text>

</TouchableOpacity>

</View>

)}

<Text style={appStyles.pnlPromptWhite}>{T('PNL_ADVICE_NO_INPUT')}</Text>

</View>

</ScrollView>

);

};



const renderPlanningTab = () => {

return (

<ScrollView contentContainerStyle={appStyles.scrollContainer}>

{/* 1. Demand Forecast */}

<View style={[appStyles.section, appStyles.demandSectionBorder]}>

<Text style={appStyles.subHeader}>{T('DEMAND_FORECAST')}</Text>

<Text style={appStyles.promptWhite}>{T('PROMPT_REGION_SELECTION')}</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={appStyles.horizontalButtonContainer}>

{MANDI_LIST.map(mandi => (

<TouchableOpacity key={mandi} onPress={() => fetchAndDisplayDemandForecast(mandi)}>

<View style={[appStyles.cropButton, { backgroundColor: demandSelectedMandi === mandi ? ACCENT_COLOR : CROP_COLORS['Rice'] }]}>

<Text style={appStyles.cropButtonText}>{mandi.split('(')[0].trim()}</Text>

</View>

</TouchableOpacity>

))}

</ScrollView>

<ForecastResultDisplay forecastData={demandForecastData} onClose={resetDemandForecast} styles={appStyles} T={T} T_CROP={T_CROP} />

</View>



{/* 2. Smart Irrigation Scheduler */}

<View style={[appStyles.section, appStyles.weatherSectionBorder]}>

<Text style={appStyles.subHeader}>{T('IRRIGATION_SCHEDULER')}</Text>

<Text style={appStyles.promptWhite}>Select crop for schedule:</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={appStyles.horizontalButtonContainer}>

{availableCrops.slice(0, 6).map(crop => (

<TouchableOpacity key={`irri-${crop}`} onPress={() => generateIrrigationSchedule(crop)}>

<View style={[appStyles.cropButton, { backgroundColor: WEATHER_COLOR }]}>

<Text style={appStyles.cropButtonText}>{T_CROP(crop)}</Text>

</View>

</TouchableOpacity>

))}

</ScrollView>



{loading && activeTab === 'Planning' && !irrigationSchedule && !fertilizerData ? <ActivityIndicator size="large" color={WEATHER_COLOR} /> : null}

{irrigationSchedule && (

<View style={appStyles.schedulerBox}>

<Text style={appStyles.schedulerHeader}>{T('IRRIGATION_SCHEDULE', irrigationSchedule.crop)}</Text>

<Text style={appStyles.schedulerText}><Text style={{fontWeight: 'bold'}}>{T('NEXT_WATERING')}:</Text> {irrigationSchedule.nextWatering}</Text>

<Text style={appStyles.schedulerText}><Text style={{fontWeight: 'bold'}}>{T('WATER_AMOUNT')}:</Text> {irrigationSchedule.amount}</Text>

<Text style={appStyles.schedulerText}><Text style={{fontWeight: 'bold'}}>{T('IRRIGATION_ADVICE')}:</Text> {irrigationSchedule.advice}</Text>

</View>

)}

</View>


{/* 3. Soil & Nutrition Management */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: WARNING_COLOR }]}>

<Text style={appStyles.subHeader}>{T('SOIL_NUTRITION')}</Text>


<Text style={appStyles.promptWhite}>Select crop for analysis:</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={appStyles.horizontalButtonContainer}>

{availableCrops.map(crop => (

<TouchableOpacity key={`soil-${crop}`} onPress={() => generateFertilizerSuggestion(crop)}>

<View style={[appStyles.cropButton, { backgroundColor: CROP_COLORS[crop] || WARNING_COLOR }]}>

<Text style={appStyles.cropButtonText}>{T_CROP(crop)}</Text>

</View>

</TouchableOpacity>

))}

</ScrollView>


{loading && activeTab === 'Planning' && !fertilizerData && !irrigationSchedule ? <ActivityIndicator size="large" color={WARNING_COLOR} /> : null}


{fertilizerData && (

<View style={appStyles.fertilizerBox}>

<Text style={[appStyles.schedulerHeader, {color: WARNING_COLOR}]}>{T('FERTILIZER_SUGGESTION')}</Text>


<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('SOIL_TYPE')}</Text>

<Text style={appStyles.metricValue}>{fertilizerData.soil_type}</Text>

</View>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('SOIL_TREATMENT')}</Text>

<Text style={appStyles.metricValue}>{fertilizerData.soil_treatment}</Text>

</View>


<View style={[appStyles.metricRowSmall, { marginTop: 10 }]}>

<Text style={appStyles.metricLabel}>{T('NPK_SUGGESTION')}</Text>

<Text style={appStyles.metricValue}>{fertilizerData.npk_suggestion}</Text>

</View>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('MICRO_NUTRIENTS')}</Text>

<Text style={appStyles.metricValue}>{fertilizerData.micro_nutrients}</Text>

</View>

</View>

)}

</View>


</ScrollView>

);

};



const renderFinanceTab = () => {

const { income, expense, net, expensePieData, incomePieData } = calculateCashFlow();

const pieChartConfig = {

color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

legendFontColor: TEXT_COLOR,

legendFontSize: 13,

fillShadowGradient: PRIMARY_DARK,

fillShadowGradientOpacity: 0.5,

backgroundColor: SECONDARY_CARD,

};


const userProfile = { landSize: 'SMF (Small/Marginal Farmers)' };



const isEligible = (scheme) => {

if (scheme.eligibility === 'All Farmers') return true;

if (scheme.eligibility === 'SMF (Small/Marginal Farmers)' && userProfile.landSize === 'SMF (Small/Marginal Farmers)') return true;

return false;

};





return (

<ScrollView contentContainerStyle={appStyles.scrollContainer}>


{/* 1. Dashboard Summary */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: '#1E90FF' }]}>

<Text style={appStyles.subHeader}>{T('DASHBOARD_SUMMARY')}</Text>


<View style={appStyles.cashFlowSummary}>

<Text style={[appStyles.metricValueLarge, { color: ACCENT_COLOR }]}>{T('TOTAL_INCOME')}: {RUPEE_SYMBOL}{income.toLocaleString()}</Text>

<Text style={[appStyles.metricValueLarge, { color: WARNING_COLOR }]}>{T('TOTAL_EXPENSES')}: {RUPEE_SYMBOL}{expense.toLocaleString()}</Text>

<Text style={[appStyles.metricValueLarge, { color: net >= 0 ? '#00FFFF' : '#FF6347', fontWeight: 'bold' }]}>{T('NET_CASH_FLOW')}: {RUPEE_SYMBOL}{net.toLocaleString()}</Text>

</View>


{/* NEW: Income Source Breakdown */}

<Text style={[appStyles.subHeader, { marginTop: 10 }]}>{T('INCOME_BREAKDOWN')}</Text>

{incomePieData.length > 0 && income > 0 ? (

<PieChart

data={incomePieData}

width={screenWidth - 50}

height={200}

chartConfig={pieChartConfig}

accessor={"population"}

backgroundColor={"transparent"}

paddingLeft={"15"}

center={[10, 0]}

absolute

/>

) : (

<Text style={appStyles.noData}>No income recorded for breakdown.</Text>

)}


{/* Expense Breakdown */}

<Text style={[appStyles.subHeader, { marginTop: 10 }]}>{T('EXPENSE_BREAKDOWN')}</Text>

{expensePieData.length > 0 && expense > 0 ? (

<PieChart

data={expensePieData}

width={screenWidth - 50}

height={200}

chartConfig={pieChartConfig}

accessor={"population"}

backgroundColor={"transparent"}

paddingLeft={"15"}

center={[10, 0]}

absolute

/>

) : (

<Text style={appStyles.noData}>No expenses recorded for breakdown.</Text>

)}

</View>



{/* 2. Transaction Logger & Upload */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: WARNING_COLOR }]}>

<Text style={appStyles.subHeader}>{T('CASH_FLOW_TRACKER')}</Text>


<Text style={[appStyles.promptWhite, { marginTop: 15 }]}>{T('LOG_NEW_ENTRY')}</Text>


{/* Bill Upload Section */}

<TouchableOpacity onPress={handleBillUpload} style={{marginBottom: 15}}>

<Button title={T('UPLOAD_BILL')} onPress={handleBillUpload} color={WARNING_COLOR} />

</TouchableOpacity>



<View style={appStyles.logInputContainer}>

<TextInput

style={[appStyles.input, { flex: 2, marginRight: 8, marginBottom: 0, borderBottomColor: '#1E90FF' }]}

placeholder={T('ENTRY_DESCRIPTION')}

placeholderTextColor="#999"

onChangeText={setLogDescription}

value={logDescription}

/>

<TextInput

style={[appStyles.input, { flex: 1, marginBottom: 0, borderBottomColor: '#1E90FF', textAlign: 'right' }]}

placeholder={T('AMOUNT')}

placeholderTextColor="#999"

keyboardType="numeric"

onChangeText={setLogAmount}

value={logAmount}

/>

</View>

<View style={appStyles.logButtonRow}>

<View style={appStyles.logTypeSelector}>

<TouchableOpacity onPress={() => setLogType('Income')} style={[appStyles.logTypeButton, logType === 'Income' && appStyles.logTypeButtonActiveIncome]}>

<Text style={appStyles.logTypeButtonText}>{T('INCOME')}</Text>

</TouchableOpacity>

<TouchableOpacity onPress={() => setLogType('Expense')} style={[appStyles.logTypeButton, logType === 'Expense' && appStyles.logTypeButtonActiveExpense]}>

<Text style={appStyles.logTypeButtonText}>{T('EXPENSE')}</Text>

</TouchableOpacity>

</View>

<Button title={T('LOG_BUTTON')} onPress={handleLogEntry} color="#1E90FF" />

</View>


{/* Transaction History */}

<Text style={[appStyles.subHeader, { marginTop: 20 }]}>{T('TRANSACTION_RECORD')}</Text>

{financialEntries.slice(0, 5).map((entry, index) => (

<View key={index} style={[appStyles.metricRowSmall, { borderColor: entry.type === 'Income' ? ACCENT_COLOR : WARNING_COLOR }]}>

<Text style={[appStyles.metricLabel, { flex: 4, color: TEXT_COLOR }]}>{entry.description}</Text>

<Text style={[appStyles.metricValue, { color: entry.type === 'Income' ? ACCENT_COLOR : '#FF6347', flex: 2 }]}>

{entry.type === 'Income' ? '+' : '-'}{RUPEE_SYMBOL}{entry.amount.toLocaleString()}

</Text>

</View>

))}

</View>


{/* 3. Loan & Subsidy Hub */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: ACCENT_COLOR }]}>

<Text style={appStyles.subHeader}>{T('LOAN_SUBSIDY_HUB')}</Text>


{activeLoans.length > 0 ? (

activeLoans.map((loan) => {

const repayment = checkRepaymentDue(loan.repaymentDate);

const isSubsidy = !!loan.isSubsidy;

const statusColor = loan.subsidyStatus === T('STATUS_APPROVED') ? ACCENT_COLOR : WARNING_COLOR;



return (

<View key={loan.id} style={{ marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#3a3a5a' }}>


{/* Loan Repayment Alert / Status */}

<View style={[appStyles.loanAlertBox, {

backgroundColor: repayment.alert ? '#FF6347' : PRIMARY_DARK,

borderColor: repayment.alert ? '#FF0000' : (isSubsidy ? ACCENT_COLOR : '#1E90FF'),

}]}>

<Text style={appStyles.loanAlertText}>

{isSubsidy

? `${loan.scheme}: ${loan.subsidyStatus}`

: repayment.alert

? `${T('REPAYMENT_ALERT')} ${loan.scheme} due in **${repayment.days} days**!`

: `${T('ACTIVE_LOAN')}: ${loan.scheme}`

}

</Text>

</View>


{/* Details */}

<View style={{ marginTop: 15, paddingHorizontal: 5 }}>


<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('LOAN_NAME')}:</Text>

<Text style={appStyles.metricValue}>{loan.scheme}</Text>

</View>


{!isSubsidy && (

<>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('LOAN_AMOUNT')}</Text>

<Text style={appStyles.metricValue}>{RUPEE_SYMBOL}{loan.loanAmount.toLocaleString()}</Text>

</View>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('NEXT_REPAYMENT')}</Text>

<Text style={appStyles.metricValue}>{loan.repaymentDate || 'N/A'}</Text>

</View>

</>

)}

{isSubsidy && (

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('SUBSIDY_STATUS')}</Text>

<Text style={[appStyles.metricValue, { color: statusColor }]}>{loan.subsidyStatus}</Text>

</View>

)}

</View>


<View style={{ marginTop: 10 }}>

{isSubsidy && (

<Button title={T('CHECK_STATUS')} onPress={() => Alert.alert("Real-time Check", `Checking status for ${loan.scheme}...`)} color="#1E90FF" />

)}

</View>

</View>

);

})

) : (

<Text style={appStyles.noData}>No active loans or subsidies found.</Text>

)}


{/* Add Loan Button */}

<TouchableOpacity onPress={() => setLoanModalVisible(true)} style={{ marginTop: 10 }}>

<Button title={T('ADD_LOAN')} onPress={() => setLoanModalVisible(true)} color={ACCENT_COLOR} />

</TouchableOpacity>



</View>


{/* 4. Schemes Portal (Moved from separate tab) */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: '#00FFFF' }]}>

<Text style={appStyles.subHeader}>{T('GOVT_SCHEMES')}</Text>

<Text style={appStyles.promptWhite}>

Showing schemes based on your profile (Land Size: <Text style={{fontWeight: 'bold', color: WARNING_COLOR}}>SMF</Text>).

</Text>


{SCHEMES_DATABASE.map((scheme) => {

const eligible = isEligible(scheme);

const cardStyle = {

borderColor: scheme.color,

borderWidth: eligible ? 2 : 1,

backgroundColor: eligible ? PRIMARY_DARK : '#3a3a5a'

};

const textColor = eligible ? TEXT_COLOR : '#999';



return (

<View key={scheme.id} style={[appStyles.schemeCard, cardStyle]}>

<View style={appStyles.schemeHeader}>

<Text style={[appStyles.schemeTitle, { color: scheme.color }]}>{scheme.name} ({scheme.type})</Text>

<Text style={[appStyles.schemeStatus, { color: eligible ? ACCENT_COLOR : '#FF6347' }]}>

{eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}

</Text>

</View>


<View style={appStyles.schemeBody}>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('SCHEME_BENEFIT')}</Text>

<Text style={[appStyles.metricValue, { color: textColor }]}>{scheme.benefit}</Text>

</View>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('SCHEME_ELIGIBILITY')}</Text>

<Text style={[appStyles.metricValue, { color: textColor }]}>{scheme.eligibility}</Text>

</View>

</View>

<TouchableOpacity style={{ marginTop: 10 }}>

<Button title={T('SCHEME_APPLY')} onPress={() => Alert.alert("Application Link", `Redirecting to government portal for ${scheme.name}...`)} color="#1E90FF" />

</TouchableOpacity>

</View>

);

})}

</View>





</ScrollView>

);

};



const renderStatementsTab = () => {

// Mock P&L Data

const mockPL = {

revenue: 125000, // Total Income: 35000 (Wheat) + 12000 (Milk) + 6000 (DBT) + 72000 (Other Crop) = 125000

cogs: 50000, // Fertilizer + Pesticide + Other Direct Costs

opExpense: 20000, // Labor + Machinery/Repair

};

const grossProfit = mockPL.revenue - mockPL.cogs;

const netProfit = grossProfit - mockPL.opExpense;



// Mock Loan Schedule Data (Active Loans from state)

const loanSchedule = activeLoans.filter(loan => !loan.isSubsidy);



return (

<ScrollView contentContainerStyle={appStyles.scrollContainer}>


{/* 1. Profit & Loss Statement */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: STATEMENT_COLOR }]}>

<Text style={appStyles.subHeader}>{T('PL_SUMMARY')}</Text>



<View style={appStyles.plStatementContainer}>

{/* Gross Revenue */}

<View style={appStyles.plItem}>

<Text style={appStyles.plLabel}>{T('GROSS_REVENUE')}</Text>

<Text style={appStyles.plValue}>{RUPEE_SYMBOL}{mockPL.revenue.toLocaleString()}</Text>

</View>

{/* COGS */}

<View style={appStyles.plItem}>

<Text style={appStyles.plLabel}>- {T('COGS')}</Text>

<Text style={appStyles.plValueNegative}>({RUPEE_SYMBOL}{mockPL.cogs.toLocaleString()})</Text>

</View>

<View style={appStyles.plDivider} />

{/* Gross Profit */}

<View style={appStyles.plItem}>

<Text style={appStyles.plLabelStrong}>{T('GROSS_PROFIT')}</Text>

<Text style={appStyles.plValueStrong}>{RUPEE_SYMBOL}{grossProfit.toLocaleString()}</Text>

</View>

{/* Op Expense */}

<View style={[appStyles.plItem, {marginTop: 10}]}>

<Text style={appStyles.plLabel}>- {T('OP_EXPENSE')}</Text>

<Text style={appStyles.plValueNegative}>({RUPEE_SYMBOL}{mockPL.opExpense.toLocaleString()})</Text>

</View>

<View style={[appStyles.plDivider, {borderColor: ACCENT_COLOR}]} />

{/* Net Profit */}

<View style={appStyles.plItem}>

<Text style={[appStyles.plLabelStrong, {fontSize: 18, color: ACCENT_COLOR}]}>{T('NET_PROFIT')}</Text>

<Text style={[appStyles.plValueStrong, {fontSize: 18, color: ACCENT_COLOR}]}>{RUPEE_SYMBOL}{netProfit.toLocaleString()}</Text>

</View>

</View>

</View>



{/* 2. Loan Repayment Schedule */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: WARNING_COLOR }]}>

<Text style={appStyles.subHeader}>{T('LOAN_SCHEDULE_HEADER')}</Text>

<View style={appStyles.modalTableHeader}>

<Text style={[appStyles.modalHeaderText, { flex: 5 }]}>{T('LOAN_NAME_SCH')}</Text>

<Text style={[appStyles.modalHeaderText, { flex: 3, textAlign: 'right' }]}>{T('AMOUNT_DUE')}</Text>

<Text style={[appStyles.modalHeaderText, { flex: 3, textAlign: 'right' }]}>{T('DUE_DATE')}</Text>

</View>

{loanSchedule.map((loan) => {

const { alert, days } = checkRepaymentDue(loan.repaymentDate);

const dateColor = alert ? '#FF6347' : TEXT_COLOR;

return (

<View key={loan.id} style={appStyles.modalTableRow}>

<Text style={[appStyles.modalRowText, { flex: 5 }]}>{loan.scheme}</Text>

<Text style={[appStyles.modalRowText, { flex: 3, textAlign: 'right' }]}>{RUPEE_SYMBOL}{loan.nextRepayment.toLocaleString()}</Text>

<Text style={[appStyles.modalRowText, { flex: 3, textAlign: 'right', color: dateColor }]}>

{loan.repaymentDate}

</Text>

</View>

);

})}

</View>

</ScrollView>

);

};



const renderTaxTab = () => {

return (

<ScrollView contentContainerStyle={appStyles.scrollContainer}>

{/* 1. Tax & Savings Hub */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: TAX_COLOR }]}>

<Text style={appStyles.subHeader}>{T('TAX_SAVINGS_HUB')}</Text>



{/* Tax Advice */}

<View style={[appStyles.answerBox, { borderColor: TAX_COLOR, borderLeftColor: TAX_COLOR }]}>

<Text style={[appStyles.answerHeader, {color: TAX_COLOR}]}>{T('TAX_ADVICE')}</Text>

<Text style={appStyles.answer}>

Since your farm income is below the threshold, file an ITR-4 to declare presumptive income. Ensure all **fertilizer/seed receipts are categorized as expenses** for deduction purposes. Maximize deduction under Section 80C.

</Text>

</View>



{/* Document Upload */}

<Text style={[appStyles.promptWhite, { marginTop: 20 }]}>{T('TAX_DOCUMENTS')}</Text>

<TouchableOpacity onPress={() => Alert.alert("Upload Feature", "Simulating document upload and auto-scanning for tax preparation...")}>

<View style={[appStyles.aiButtonWrapper, { backgroundColor: ACCENT_COLOR }]}>

<Button title={T('UPLOAD_DOCS')} onPress={() => Alert.alert("Upload Feature", "Simulating document upload and auto-scanning for tax preparation...")} color="transparent" />

</View>

</TouchableOpacity>

</View>



{/* 2. Savings & Investment */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: ACCENT_COLOR }]}>

<Text style={appStyles.subHeader}>{T('INV_ADVICE')}</Text>

<View style={[appStyles.answerBox, { borderLeftColor: ACCENT_COLOR }]}>

<Text style={[appStyles.answerHeader, {color: ACCENT_COLOR}]}>Risk Profile: Conservative</Text>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('INV_AMOUNT')}</Text>

<Text style={appStyles.metricValue}>{RUPEE_SYMBOL}5,000</Text>

</View>

<Text style={[appStyles.answer, { marginTop: 10 }]}>

**Recommendation:** Allocate 60% to **Kisan Vikas Patra (KVP)** for guaranteed returns and 40% to **Equity Linked Savings Scheme (ELSS)** for tax benefits under 80C and market exposure.

</Text>

</View>

</View>

</ScrollView>

);

};



const renderAssistantTab = () => {


return (

<ScrollView contentContainerStyle={appStyles.scrollContainer}>


{/* 1. AI Selling Advisor */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: WARNING_COLOR }]}>

<Text style={appStyles.subHeader}>{T('AI_SELLING_ADVISOR')}</Text>

<Text style={appStyles.promptWhite}>{T('ADVISOR_PROMPT')}</Text>


{/* Crop Selection for Advisor */}

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={appStyles.horizontalButtonContainer}>

{availableCrops.map(crop => (

<TouchableOpacity key={`advisor-${crop}`} onPress={() => generateSellingAdvice(crop)}>

<View style={[appStyles.cropButton, { backgroundColor: CROP_COLORS[crop] || WARNING_COLOR }]}>

<Text style={appStyles.cropButtonText}>{T_CROP(crop)}</Text>

</View>

</TouchableOpacity>

))}

</ScrollView>


{loading && activeTab === 'Assistant' && !sellingAdvisorData && !diagnosisResult ? <ActivityIndicator size="large" color={WARNING_COLOR} /> : null}



{sellingAdvisorData && (

<View style={[appStyles.recommendationBox, { backgroundColor: PRIMARY_DARK, borderColor: WARNING_COLOR, borderLeftWidth: 4 }]}>

<Text style={[appStyles.recommendationHeader, { color: WARNING_COLOR }]}>{T('ADVISOR_REC_HEADER')}</Text>


{/* --- GEO VISUALIZER SIMULATION --- */}

<View style={appStyles.mapVisualizer}>

<Text style={appStyles.mapIcon}>🏡</Text>

<View style={appStyles.mapLine}>

<Text style={appStyles.mapDistanceText}>

{sellingAdvisorData.distance} ({sellingAdvisorData.transport_time})

</Text>

</View>

<Text style={appStyles.mapIcon}>🏪</Text>

</View>

<Text style={[appStyles.promptWhite, { textAlign: 'center', marginBottom: 10, marginTop: 5 }]}>

{T('ADVISOR_LOCATION')}: <Text style={{ fontWeight: 'bold' }}>{sellingAdvisorData.mandi}</Text>

</Text>

{/* --- END GEO VISUALIZER SIMULATION --- */}



<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('SELLING_TIME')}</Text>

<Text style={[appStyles.metricValue, { color: sellingAdvisorData.time === T('SELL_NOW') ? ACCENT_COLOR : '#FF6347' }]}>

{sellingAdvisorData.time}

</Text>

</View>


<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('NET_PROFIT')}</Text>

<Text style={[appStyles.metricValue, { color: ACCENT_COLOR }]}>{sellingAdvisorData.profit}</Text>

</View>

<View style={appStyles.metricRowSmall}>

<Text style={appStyles.metricLabel}>{T('ADVISOR_TRANSPORT')}</Text>

<Text style={appStyles.metricValue}>{sellingAdvisorData.cost}</Text>

</View>



<Text style={[appStyles.forecastReasonText, { marginTop: 10, color: TEXT_COLOR }]}>

Based on local price trends and logistic data for {sellingAdvisorData.crop}.

</Text>

</View>

)}

</View>



{/* 2. Crop Health Analyst */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: ACCENT_COLOR }]}>

<Text style={appStyles.subHeader}>{T('CROP_HEALTH_ANALYST')}</Text>

<Text style={appStyles.promptWhite}>{T('PEST_DIAGNOSIS_PROMPT')}</Text>


<TouchableOpacity onPress={handlePhotoUpload}>

<View style={[appStyles.aiButtonWrapper, { backgroundColor: ACCENT_COLOR }]}>

<Button title={T('UPLOAD_PHOTO')} onPress={handlePhotoUpload} color="transparent" />

</View>

</TouchableOpacity>


{loading && activeTab === 'Assistant' && diagnosisResult && <ActivityIndicator size="large" color={ACCENT_COLOR} />}



{diagnosisResult ? (

<View style={appStyles.answerBox}>

<Text style={appStyles.answerHeader}>{T('DIAGNOSIS_RESULT')}</Text>

<Text style={appStyles.answer}><Text style={{fontWeight: 'bold', color: WARNING_COLOR}}>Disease:</Text> {diagnosisResult.disease}</Text>

<Text style={appStyles.answer}><Text style={{fontWeight: 'bold', color: WARNING_COLOR}}>Impact:</Text> {diagnosisResult.impact}</Text>

<Text style={appStyles.answer}><Text style={{fontWeight: 'bold', color: ACCENT_COLOR}}>Treatment:</Text> {diagnosisResult.treatment}</Text>

</View>

) : !loading && diagnosisResult === null && (

<Text style={appStyles.noData}>{T('NO_DIAGNOSIS')}</Text>

)}

</View>


{/* 3. Financial Assistant (AI) - Now AMAZON BEDROCK AI AGENT */}

<View style={[appStyles.section, { borderLeftWidth: 3, borderLeftColor: '#1E90FF' }]}>

<Text style={appStyles.subHeader}>{T('FINANCIAL_ASSISTANT')}</Text>

<TextInput style={appStyles.input} placeholder={T('FINANCIAL_PROMPT')} onChangeText={setQuestion} value={question} multiline placeholderTextColor="#999" />

<TouchableOpacity onPress={askAI}>

<View style={appStyles.aiButtonWrapper}>

<Button title={T('ASK_AI_BUTTON')} onPress={askAI} color="transparent" />

</View>

</TouchableOpacity>

{loading && activeTab === 'Assistant' && <ActivityIndicator size="large" color={'#1E90FF'} />}

{answer ? (<View style={appStyles.answerBox}><Text style={appStyles.answerHeader}>{T('AI_RESPONSE_HEADER')}</Text><Text style={appStyles.answer}>{answer}</Text></View>) : null}

</View>



</ScrollView>

);

};



const renderWeatherTab = () => {

return (

<ScrollView contentContainerStyle={appStyles.scrollContainer}>

<View style={[appStyles.section, appStyles.weatherSectionBorder]}>

<Text style={appStyles.subHeader}>{T('WEATHER_FORECAST')}</Text>

{weatherData ? (

<View>

<Text style={appStyles.promptWhite}>{T('WEATHER_PROMPT')}</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={appStyles.horizontalButtonContainer}>

{MANDI_LIST.map(mandi => (

<TouchableOpacity key={`weather-${mandi}`} onPress={() => fetchWeather(mandi)}>

<View style={[appStyles.cropButton, { backgroundColor: weatherSelectedMandi === mandi ? ACCENT_COLOR : WEATHER_COLOR }]}>

<Text style={appStyles.cropButtonText}>{mandi.split('(')[0].trim()}</Text>

</View>

</TouchableOpacity>

))}

</ScrollView>



<Text style={appStyles.weatherLocation}>{T('WEATHER_IN')} {weatherData.location}:</Text>


{/* ENHANCED 3-Day Forecast Display */}

<View style={appStyles.forecastContainer}>

{weatherData.forecast && weatherData.forecast.slice(0, 3).map((day, index) => (

<View key={index} style={[appStyles.forecastDay, index === 2 && {borderRightWidth: 0}]}>

<Text style={appStyles.forecastText}>{day.day}</Text>

<Text style={appStyles.forecastTemp}>{day.high_c}° / {day.low_c}°</Text>

<Text style={appStyles.forecastCondition}>{day.condition}</Text>

</View>

))}
    
</View>



{/* ENHANCED Extended Outlook Display */}

<Text style={[appStyles.subHeader, {marginTop: 20}]}>{T('EXTENDED_FORECAST')}</Text>

<View style={appStyles.extendedForecastContainer}>

{weatherData.extendedForecast && weatherData.extendedForecast.map((day, index) => (

<View key={index} style={appStyles.extendedForecastItem}>

<Text style={appStyles.extendedDay}>{day.day}</Text>

<Text style={appStyles.extendedTemp}>{day.temp}</Text>

<Text style={appStyles.extendedCondition}>{day.condition}</Text>

</View>

))}

</View>

</View>

) : ( <ActivityIndicator size="small" color={WEATHER_COLOR} /> )}

</View>

</ScrollView>

);

};


const renderContent = () => {

switch (activeTab) {

case 'Home': return renderHomeTab();

case 'Market': return renderMarketTab();

case 'Planning': return renderPlanningTab();

case 'Finance': return renderFinanceTab();

case 'Statements': return renderStatementsTab();

case 'Tax': return renderTaxTab();

case 'Assistant': return renderAssistantTab();

case 'Weather': return renderWeatherTab();

default: return renderHomeTab();

}

};



const tabButtons = [

{ key: 'Home', name: T('TAB_HOME') },

{ key: 'Market', name: T('TAB_MARKET') },

{ key: 'Planning', name: T('TAB_PLANNING') },

{ key: 'Finance', name: T('TAB_FINANCE') },

{ key: 'Statements', name: T('TAB_STATEMENTS') },

{ key: 'Tax', name: T('TAB_TAX') },

{ key: 'Assistant', name: T('TAB_ADVISOR') },

{ key: 'Weather', name: T('TAB_WEATHER') },

].filter((_, index) => index < 7); // Max 7 tabs displayed



const LANGUAGES = [

{ key: 'en', name: 'EN' },

{ key: 'hi', name: 'HI' },

{ key: 'te', name: 'TE' },

{ key: 'ta', name: 'TA' },

{ key: 'ml', name: 'ML' },

];



return (

<View style={appStyles.container}>

<PnlDrillDownModal isVisible={pnlVisible} onClose={() => setPnlVisible(false)} pnlData={pnlData} selectedCrop={selectedCrop} styles={appStyles} T={T} T_CROP={T_CROP} />


{/* NEW Loan Entry Modal */}

<LoanEntryModal isVisible={loanModalVisible} onClose={() => setLoanModalVisible(false)} T={T} addNewLoan={addNewLoan} />


{/* --- Global Header & Status (Centered) --- */}

<View style={appStyles.globalHeader}>

<View style={{ width: 60 }} />

<Text style={appStyles.header}>{T('HEADER')}</Text>

<View style={appStyles.languageSelectorContainer}>

{LANGUAGES.map((lang) => (

<TouchableOpacity key={lang.key} onPress={() => setCurrentLanguage(lang.key)} style={[appStyles.languageButton, currentLanguage === lang.key && appStyles.languageButtonActive]}>

<Text style={appStyles.languageButtonText}>{lang.name}</Text>

</TouchableOpacity>

))}

</View>

</View>

<Text style={[appStyles.status, { color: ACCENT_COLOR }]}>{status}</Text>



{/* --- Main Content (Scrollable based on Tab) --- */}

<View style={appStyles.contentContainer}>

{renderContent()}

</View>



{/* --- Bottom Tab Navigator --- */}

<View style={appStyles.bottomTabBar}>

{tabButtons.map((tab) => (

<TouchableOpacity

key={tab.key}

style={[appStyles.tabButton, activeTab === tab.key && appStyles.tabButtonActive]}

onPress={() => setActiveTab(tab.key)}

>

<Text style={[appStyles.tabButtonText, activeTab === tab.key && appStyles.tabButtonTextActive]}>{tab.name}</Text>

</TouchableOpacity>

))}

</View>

</View>

);

}



// --- STYLESHEET DEFINITIONS ---

const appStyles = StyleSheet.create({

container: { flex: 1, backgroundColor: PRIMARY_DARK },

globalHeader: { paddingTop: 40, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },

header: { flex: 1, textAlign: 'center', fontSize: 26, fontWeight: "900", color: '#00FFFF', textShadowColor: 'rgba(0, 255, 255, 0.7)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8, },

status: { textAlign: "center", marginBottom: 15, marginTop: 5, fontSize: 14, fontStyle: 'italic', paddingHorizontal: 20, },

contentContainer: { flex: 1, },

scrollContainer: { padding: 15, paddingBottom: 20 },



// --- Section Styling ---

section: {

marginBottom: 25,

padding: 18,

backgroundColor: SECONDARY_CARD,

borderRadius: 12,

borderWidth: 0,

shadowColor: '#00FFFF',

shadowOffset: { width: 0, height: 4 },

shadowOpacity: 0.2,

shadowRadius: 5,

elevation: 8,

},

marketSectionBorder: { borderLeftWidth: 3, borderLeftColor: ACCENT_COLOR, },

pnlSectionBorder: { borderLeftWidth: 3, borderLeftColor: WARNING_COLOR, },

demandSectionBorder: { borderLeftWidth: 3, borderLeftColor: '#00FFFF', },

weatherSectionBorder: { borderLeftWidth: 3, borderLeftColor: WEATHER_COLOR, },



subHeader: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: TEXT_COLOR },


// --- Subheading prompt text color to white ---

promptWhite: { fontSize: 15, color: '#FFFFFF', marginBottom: 10, fontWeight: '600' },

promptPricesWhite: { fontSize: 15, color: '#FFFFFF', marginBottom: 10, marginTop: 10, fontWeight: '600' },

pnlPromptWhite: { fontSize: 14, color: '#FFFFFF', fontStyle: 'italic', textAlign: 'center', marginTop: 10 },


// --- Optimized Button Layout (Horizontal Scroll) ---

horizontalButtonContainer: {

flexDirection: 'row',

alignItems: 'center',

marginBottom: 10,

paddingVertical: 5,

},

cropButton: {

paddingHorizontal: 12,

paddingVertical: 8,

borderRadius: 20,

marginHorizontal: 5,

minWidth: 80,

alignItems: 'center',

shadowColor: '#000',

shadowOffset: { width: 0, height: 1 },

shadowOpacity: 0.6,

shadowRadius: 2,

elevation: 3,

},

cropButtonText: { color: PRIMARY_DARK, fontWeight: '700', fontSize: 14 },


// --- Market Price List Styles ---

recommendationBox: { backgroundColor: '#3a3a5a', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: ACCENT_COLOR, marginBottom: 15, alignItems: 'flex-start' },

recommendationHeader: { fontWeight: '900', color: ACCENT_COLOR, fontSize: 15, marginBottom: 3, },

recommendationText: { fontSize: 16, fontWeight: '800', color: TEXT_COLOR, },

priceList: { marginTop: 10, marginBottom: 20, borderTopWidth: 1, borderTopColor: '#4a4a70' },

priceItemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#4a4a70' },

cityText: { fontSize: 15, color: TEXT_COLOR, fontWeight: '500' },

priceInfoContainer: { flexDirection: 'row', alignItems: 'center' },

priceText: { fontSize: 15, fontWeight: 'bold', marginRight: 5 },

trendText: { marginLeft: 5, fontSize: 12, fontWeight: '600', textShadowColor: '#000', textShadowRadius: 1 },

chartStyle: { marginLeft: -15, borderRadius: 12, borderWidth: 1, borderColor: '#4a4a70', paddingRight: 20, paddingLeft: 45, paddingBottom: 0, marginVertical: 10, },


// --- Input & AI Styles ---

input: { borderWidth: 0, borderBottomWidth: 2, borderBottomColor: '#5a5a8a', padding: 10, marginBottom: 15, backgroundColor: PRIMARY_DARK, minHeight: 45, fontSize: 16, color: TEXT_COLOR, borderRadius: 4, },

aiButtonWrapper: { backgroundColor: '#1E90FF', borderRadius: 8, overflow: 'hidden', marginBottom: 15, },

answerBox: { marginTop: 15, backgroundColor: PRIMARY_DARK, borderLeftWidth: 4, borderLeftColor: ACCENT_COLOR, padding: 15, borderRadius: 8, },

answerHeader: { fontWeight: "bold", marginBottom: 5, color: ACCENT_COLOR },

answer: { fontSize: 15, color: TEXT_COLOR },

noData: { fontSize: 14, color: '#A0A0A0', fontStyle: 'italic', marginTop: 5, textAlign: 'center' },



// --- New Feature Styles ---

optimizerAdviceBox: { marginTop: 15, padding: 15, backgroundColor: PRIMARY_DARK, borderLeftWidth: 4, borderLeftColor: WARNING_COLOR, borderRadius: 8, },



schedulerBox: { marginTop: 15, padding: 15, backgroundColor: PRIMARY_DARK, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: WEATHER_COLOR, },

schedulerHeader: { fontSize: 16, fontWeight: 'bold', color: WEATHER_COLOR, marginBottom: 8, },

schedulerText: { fontSize: 14, color: TEXT_COLOR, marginBottom: 4 },



// FERTILIZER STYLES

fertilizerBox: { marginTop: 15, padding: 15, backgroundColor: PRIMARY_DARK, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: WARNING_COLOR, },

metricRowSmall: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#3a3a5a' },

metricLabel: { color: '#A0A0A0', fontSize: 13, flex: 2 },

metricValue: { color: TEXT_COLOR, fontSize: 13, fontWeight: 'bold', flex: 3, textAlign: 'right' },


// CASH FLOW TRACKER STYLES

cashFlowSummary: { padding: 10, backgroundColor: PRIMARY_DARK, borderRadius: 8, marginBottom: 15 },

metricValueLarge: { fontSize: 15, paddingVertical: 2, color: TEXT_COLOR },

logInputContainer: { flexDirection: 'row', marginBottom: 10 },

logButtonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },

logTypeSelector: { flexDirection: 'row', flex: 1, marginRight: 10, borderWidth: 1, borderColor: '#5a5a8a', borderRadius: 8, overflow: 'hidden' },

logTypeButton: { flex: 1, padding: 8, alignItems: 'center', backgroundColor: PRIMARY_DARK },

logTypeButtonActiveIncome: { backgroundColor: ACCENT_COLOR },

logTypeButtonActiveExpense: { backgroundColor: WARNING_COLOR },

logTypeButtonText: { color: PRIMARY_DARK, fontWeight: 'bold', fontSize: 14 },


// LOAN HUB STYLES

loanAlertBox: { padding: 10, borderRadius: 8, marginVertical: 10, borderWidth: 1, borderColor: '#FF6347' },

loanAlertText: { color: TEXT_COLOR, fontWeight: '600', fontSize: 15, textAlign: 'center' },





// SCHEME CARD STYLES

schemeCard: {

padding: 15,

borderRadius: 10,

marginBottom: 15,

backgroundColor: PRIMARY_DARK,

},

schemeHeader: {

flexDirection: 'row',

justifyContent: 'space-between',

alignItems: 'center',

marginBottom: 10,

},

schemeTitle: {

fontSize: 16,

fontWeight: 'bold',

flex: 3,

},

schemeStatus: {

fontSize: 12,

fontWeight: '900',

paddingHorizontal: 8,

paddingVertical: 3,

backgroundColor: SECONDARY_CARD,

borderRadius: 5,

},

schemeBody: {

marginTop: 5,

marginBottom: 10,

borderBottomWidth: 1,

borderBottomColor: '#3a3a5a',

paddingBottom: 5,

},





// DEMAND FORECAST ENHANCEMENTS

forecastResultContainer: {

padding: 15,

backgroundColor: PRIMARY_DARK,

borderRadius: 10,

borderWidth: 1,

borderColor: '#00FFFF',

marginTop: 15

},

forecastResultHeader: { fontSize: 16, fontWeight: '600', color: TEXT_COLOR, marginBottom: 10, },

forecastPrimaryBox: {

paddingVertical: 5,

marginBottom: 10,

borderLeftWidth: 3,

borderLeftColor: ACCENT_COLOR,

paddingLeft: 10,

},

forecastPrimaryCrop: { fontSize: 22, fontWeight: 'bold', marginTop: 3 },

forecastDetailBox: { marginHorizontal: 5, marginBottom: 15 },

forecastScoreText: { fontSize: 16, color: TEXT_COLOR, marginBottom: 5 },

forecastReasonText: { fontSize: 14, color: '#A0A0A0', fontStyle: 'italic', lineHeight: 20 },

forecastDivider: { borderBottomWidth: 1, borderBottomColor: '#3a3a5a', marginVertical: 10, },

forecastSecondaryHeader: { fontSize: 16, fontWeight: 'bold', color: TEXT_COLOR, marginBottom: 10 },

forecastSecondaryItem: { paddingVertical: 3 },

forecastSecondaryText: { fontSize: 14, color: TEXT_COLOR },



// WEATHER FORECAST ENHANCEMENTS

forecastContainer: {

flexDirection: 'row',

justifyContent: 'space-between',

borderTopWidth: 1,

borderTopColor: '#4a4a70',

paddingTop: 10,

marginBottom: 10,

},

forecastDay: {

alignItems: 'center',

flex: 1,

paddingVertical: 5,

borderRightWidth: 1,

borderRightColor: '#3a3a5a',

},

forecastText: { color: TEXT_COLOR, fontWeight: 'bold', fontSize: 14 },

forecastTemp: { color: WEATHER_COLOR, fontSize: 15, marginVertical: 4 },

forecastCondition: { color: '#aaa', fontSize: 11, textAlign: 'center' },


extendedForecastContainer: {

flexDirection: 'row',

justifyContent: 'space-around',

padding: 10,

backgroundColor: PRIMARY_DARK,

borderRadius: 8,

borderWidth: 1,

borderColor: '#3a3a5a',

marginTop: 10,

},

extendedForecastItem: {

alignItems: 'center',

padding: 5,

flex: 1,

minWidth: 80,

},

extendedDay: { color: WARNING_COLOR, fontWeight: 'bold', fontSize: 12 },

extendedTemp: { color: TEXT_COLOR, fontSize: 14, marginVertical: 3 },

extendedCondition: { color: '#aaa', fontSize: 10 },


// DASHBOARD STYLES

dashboardTitle: {

fontSize: 22,

fontWeight: 'bold',

color: TEXT_COLOR,

marginBottom: 30,

textAlign: 'center'

},

dashboardGrid: {

flexDirection: 'row',

flexWrap: 'wrap',

justifyContent: 'space-around',

width: '100%',

},

dashboardCardWrapper: {

width: '45%',

marginBottom: 20,

marginHorizontal: '2.5%',

},

dashboardCard: {

backgroundColor: SECONDARY_CARD,

padding: 15,

borderRadius: 12,

borderWidth: 2,

alignItems: 'center',

height: 150,

justifyContent: 'space-around',

shadowColor: '#000',

shadowOffset: { width: 0, height: 4 },

shadowOpacity: 0.3,

shadowRadius: 5,

},

dashboardCardIcon: { fontSize: 30, marginBottom: 5 },

dashboardCardTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

dashboardCardDescription: { fontSize: 10, color: '#A0A0A0', textAlign: 'center', marginTop: 5 },


// --- PNL Modal Styles FIX ---

modalCenteredView: {

flex: 1,

justifyContent: "center",

alignItems: "center",

backgroundColor: 'rgba(0, 0, 0, 0.8)',

zIndex: 9999,

elevation: 9999,

},

modalView: {

width: screenWidth * 0.9,

maxHeight: screenWidth * 1.5,

backgroundColor: SECONDARY_CARD,

borderRadius: 20,

padding: 20,

shadowColor: ACCENT_COLOR,

shadowOpacity: 0.5,

elevation: 20,

borderWidth: 2,

borderColor: ACCENT_COLOR,

zIndex: 99999,

},

modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#00FFFF', marginBottom: 15, textAlign: 'center', },

modalMetricRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, padding: 8, backgroundColor: PRIMARY_DARK, borderRadius: 6, },

modalMetricBox: { fontSize: 15, color: ACCENT_COLOR, fontWeight: 'bold' },

modalScoreText: { fontSize: 16, color: TEXT_COLOR, fontWeight: '600', marginBottom: 10, },

modalAdviceText: { fontSize: 14, color: '#A0A0A0', marginBottom: 15, fontStyle: 'italic', },

modalTableHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: ACCENT_COLOR, paddingBottom: 6, marginBottom: 5, },

modalHeaderText: { color: ACCENT_COLOR, fontWeight: 'bold', fontSize: 12, textAlign: 'left', },

modalTableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#4a4a70', alignItems: 'center', },

modalRowText: { color: TEXT_COLOR, fontSize: 12, textAlign: 'left', },

modalCommentText: { color: TEXT_COLOR, fontSize: 12, },

modalTapToLearnText: { color: '#00FFFF', fontWeight: 'bold', textDecorationLine: 'underline', },

modalScrollView: { marginBottom: 15, },


// --- Tab Bar Styles ---

bottomTabBar: {

flexDirection: 'row',

height: 60,

backgroundColor: SECONDARY_CARD,

borderTopWidth: 1,

borderTopColor: PRIMARY_DARK,

elevation: 20,

shadowColor: '#00FFFF',

shadowOpacity: 0.5,

shadowRadius: 10,

},

tabButton: {

flex: 1,

justifyContent: 'center',

alignItems: 'center',

borderTopWidth: 2,

borderTopColor: 'transparent',

},

tabButtonActive: {

borderTopColor: ACCENT_COLOR,

backgroundColor: PRIMARY_DARK,

},

tabButtonText: { color: TEXT_COLOR, fontSize: 12, fontWeight: '600' },

tabButtonTextActive: { color: ACCENT_COLOR, fontWeight: '800' },



// --- Language Selector ---

languageSelectorContainer: { flexDirection: 'row', alignItems: 'center', },

languageButton: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginHorizontal: 2, backgroundColor: PRIMARY_DARK, },

languageButtonActive: { backgroundColor: ACCENT_COLOR, },

languageButtonText: { color: TEXT_COLOR, fontSize: 10, fontWeight: '600', },


// --- Specific Advisor Styles ---

mapVisualizer: {

flexDirection: 'row',

justifyContent: 'space-between',

alignItems: 'center',

paddingVertical: 15,

marginHorizontal: 20,

},

mapIcon: {

fontSize: 35,

},

mapLine: {

flex: 1,

height: 1,

backgroundColor: WARNING_COLOR,

marginHorizontal: 10,

justifyContent: 'center',

alignItems: 'center',

},

mapDistanceText: {

backgroundColor: PRIMARY_DARK,

paddingHorizontal: 5,

fontSize: 12,

color: WARNING_COLOR,

fontWeight: 'bold',

marginTop: -10, // Pull text slightly above the line

},


// --- NEW STATEMENTS STYLES ---

plStatementContainer: {

backgroundColor: PRIMARY_DARK,

borderRadius: 8,

padding: 15,

borderWidth: 1,

borderColor: STATEMENT_COLOR,

marginBottom: 15,

},

plItem: {

flexDirection: 'row',

justifyContent: 'space-between',

paddingVertical: 5,

},

plLabel: {

fontSize: 14,

color: '#A0A0A0',

},

plLabelStrong: {

fontSize: 16,

fontWeight: 'bold',

color: TEXT_COLOR,

},

plValue: {

fontSize: 14,

color: ACCENT_COLOR,

fontWeight: '500',

},

plValueNegative: {

fontSize: 14,

color: '#FF6347',

fontWeight: '500',

},

plValueStrong: {

fontSize: 16,

fontWeight: 'bold',

color: '#00FFFF',

},

plDivider: {

borderBottomWidth: 1,

borderBottomColor: '#4a4a70',

marginVertical: 5,

}

});