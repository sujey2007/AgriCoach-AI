import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Button, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Both are imported

const screenWidth = Dimensions.get("window").width;

// Use localhost for the current browser test. CHANGE THIS to your permanent Render URL for deployment.
const API_URL = 'http://localhost:8000'; 

// --- COLOR DEFINITIONS ---
const PRIMARY_DARK = '#1a1a2e';         
const SECONDARY_CARD = '#2a2a4a';       
const ACCENT_COLOR = '#4CAF50';         // Bright Green (Used for success/primary borders)
const TEXT_COLOR = '#F0F0F0';           // Light text color
const WARNING_COLOR = '#FFA500';        // Orange for negative impact
const RUPEE_SYMBOL = '\u20B9';          // Correct Unicode entity for Indian Rupee Symbol (₹)

// CROP COLORS (High Contrast)
const CROP_COLORS = {
  Tomato: '#FF6347', Onion: '#FFC300', Wheat: '#58D68D', Rice: '#3498DB', Chilli: '#AF7AC5', 
  Cotton: '#4A607A', Potato: '#E67E22', Maize: '#FFDC00', Mustard: '#D68910', Soybean: '#1F618D', 
  Coffee: '#7D6608', Sugarcane: '#1ABC9C', 
};


// --- Forecast Result Display Component (FINAL CORRECT LOCATION) ---
const ForecastResultDisplay = ({ forecastData, onClose, styles }) => { 
    if (!forecastData || !forecastData.recommendations || forecastData.recommendations.length === 0) return null;
    
    const primaryRecommendation = forecastData.recommendations[0];

    return (
        <View style={styles.forecastResultContainer}>
            <Text style={styles.forecastResultHeader}>Forecast for {forecastData.mandi} (Next Season):</Text>
            
            <View style={styles.forecastPrimaryBox}>
                <Text style={styles.forecastPrimaryText}>🥇 Primary Recommendation:</Text>
                <Text style={[styles.forecastPrimaryCrop, { color: ACCENT_COLOR }]}> {primaryRecommendation.crop}</Text>
            </View>

            <Text style={styles.forecastReasonText}>
                <Text style={{fontWeight: 'bold'}}>Score: {primaryRecommendation.score}</Text> • Reason: {primaryRecommendation.reason}
            </Text>
            
            <View style={styles.forecastDivider} />

            <Text style={styles.forecastSecondaryHeader}>Secondary Options:</Text>
            <View style={styles.secondaryOptionContainer}>
                {forecastData.recommendations.slice(1).map((rec, index) => (
                    <View key={index} style={styles.forecastSecondaryItem}>
                        <Text style={styles.forecastSecondaryText}>
                            - {rec.crop} (Score: {rec.score})
                        </Text>
                    </View>
                ))}
            </View>

            <Button title="<< Select New Region" onPress={onClose} color="#6c757d" />
        </View>
    );
};


// --- PNL Drill-Down Modal Component ---
const PnlDrillDownModal = ({ isVisible, onClose, pnlData, selectedCrop, styles }) => { 
    const handleTapToLearn = (context) => { Alert.alert("AI Insight", context, [{ text: "Got It" }]); };

    if (!pnlData) return null;

    // LOGIC: Prepare Data for Line Chart (PNL Factors vs. Impact)
    const pnlChartData = {
        labels: pnlData.reasons.map(r => r.factor.split(' ')[0]),
        datasets: [{
            data: pnlData.reasons.map(r => parseInt(r.impact)),
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }]
    };
    
    const pnlChartConfig = {
        backgroundColor: PRIMARY_DARK, backgroundGradientFrom: SECONDARY_CARD, backgroundGradientTo: PRIMARY_DARK, decimalPlaces: 0, color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: { r: "4", strokeWidth: "2", stroke: WARNING_COLOR }, formatYLabel: (y) => (y > 0 ? `+${y}` : y),
        propsForLabels: { fontSize: 9 }, // Smaller font for the crowded labels
    };


    return (
        <Modal
            animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}
        >
            <View style={styles.modalCenteredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Profit & Loss Analysis for {selectedCrop}</Text>
                    
                    <View style={styles.modalMetricRow}>
                        <Text style={styles.modalMetricBox}>Cost: {RUPEE_SYMBOL}15,500.00</Text>
                        <Text style={styles.modalMetricBox}>Revenue: {RUPEE_SYMBOL}25,000.00</Text>
                    </View>

                    {/* NEW CHART: LINE CHART for PNL Factors */}
                    <LineChart 
                        data={pnlChartData}
                        width={screenWidth * 0.8}
                        height={180}
                        chartConfig={pnlChartConfig}
                        style={styles.modalChartStyle}
                        bezier // Use line chart curve
                    />

                    <Text style={styles.modalScoreText}> Net Impact Score: <Text style={{ color: ACCENT_COLOR }}> {pnlData.net_impact_score} </Text> </Text>
                    <Text style={styles.modalAdviceText}> Advice: {pnlData.advice} </Text>

                    <ScrollView style={styles.modalScrollView}>
                        <View style={styles.modalTableHeader}>
                            <Text style={[styles.modalHeaderText, { flex: 4 }]}>Factor</Text>
                            <Text style={[styles.modalHeaderText, { flex: 2 }]}>Impact</Text>
                            <Text style={[styles.modalHeaderText, { flex: 4 }]}>Reason</Text>
                        </View>
                        
                        {pnlData.reasons.map((item, index) => {
                            const impactColor = item.impact.includes('+') ? ACCENT_COLOR : WARNING_COLOR;
                            return (
                                <View key={index} style={styles.modalTableRow}>
                                    <Text style={[styles.modalRowText, { flex: 4 }]}>{item.factor}</Text>
                                    <Text style={[styles.modalRowText, { flex: 2, color: impactColor }]}>{item.impact}</Text>
                                    
                                    <TouchableOpacity 
                                        style={{ flex: 4 }}
                                        onPress={() => handleTapToLearn(item.ai_context)}
                                    >
                                        <Text style={styles.modalCommentText}>
                                            {item.comment} <Text style={styles.modalTapToLearnText}>[Tap to Learn]</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <Button title="Close Analysis" onPress={onClose} color={ACCENT_COLOR} />
                </View>
            </View>
        </Modal>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [stage, setStage] = useState('crop_selection'); 
  const [selectedCrop, setSelectedCrop] = useState('');
  const [availableCrops] = useState(['Tomato', 'Onion', 'Wheat', 'Rice', 'Chilli', 'Cotton', 'Coffee', 'Sugarcane', 'Potato', 'Maize', 'Mustard', 'Soybean']); 
  
  const [prices, setPrices] = useState([]); 
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('Select a crop to begin.');
  const [loading, setLoading] = useState(false);

  const [demandForecastData, setDemandForecastData] = useState(null); 
  const [demandSelectedMandi, setDemandSelectedMandi] = useState(null); 
  const MANDI_LIST = ["Lucknow (UP)", "Ludhiana (PB)", "Indore (MP)", "Kolkata (WB)", "Guntur (AP)", "Jaipur (RJ)", "Bengaluru (KA)", "Rajkot (GJ)", "Karnal (HR)", "Pune (MH)", "Chennai (TN)"];


  const scaleAnim = useRef(new Animated.Value(1)).current; 
  const opacityAnim = useRef(new Animated.Value(0)).current; 
  
  const [pnlVisible, setPnlVisible] = useState(false);
  const [pnlData, setPnlData] = useState(null);

  // --- Animation Logic (restored) ---
  const animateIn = () => { Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(); };
  const handlePressIn = () => { Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start(); };
  const handlePressOut = () => { Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start(); };

  // --- Fetch PNL Data ---
  const fetchPnlAnalysis = async (cropName) => {
    const mockParams = new URLSearchParams({ crop: cropName, yield: '50', expectedPrice: '35', fertilizer: '5000', pesticide: '500', labour: '5000', other: '1000', }).toString();
    
    setStatus(`Fetching P&L analysis for ${cropName}...`);

    try {
        const response = await fetch(`${API_URL}/pnl-analysis/calculate?${mockParams}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setPnlData(data);
        setSelectedCrop(cropName);
        setPnlVisible(true); 
    } catch (error) {
        Alert.alert("Error", "Could not fetch P&L analysis data.");
        console.error("PNL Fetch Error:", error);
    }
  };

  // --- Fetch Demand Forecast Logic ---
  const fetchAndDisplayDemandForecast = async (mandiName) => {
    setStatus(`Fetching forecast for ${mandiName}...`);
    setDemandSelectedMandi(mandiName);
    
    try {
        const response = await fetch(`${API_URL}/demand-forecast/${mandiName}`);
        if (!response.ok) throw new Error("Failed to fetch forecast.");
        const data = await response.json();
        setDemandForecastData(data); 
        setStatus(`Forecast ready for ${mandiName}.`);
    } catch (error) {
        Alert.alert("Error", "Could not fetch forecast data. Check server.");
        console.error("Forecast Fetch Error:", error);
        setDemandForecastData(null); // Set to null on error to re-render buttons
    }
  };


  // --- Functions to Interact with Your Python Backend ---
  const fetchPrices = (cropName) => {
    setLoading(true);
    setStatus(`Fetching prices for ${cropName}...`);
    opacityAnim.setValue(0); 

    fetch(`${API_URL}/market-prices/${cropName}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setPrices(data.predictions || []);
        setStage('final_prices');
        setStatus(`Data fetched for ${cropName}!`);
        animateIn(); 
      })
      .catch(error => {
        console.error("Error fetching prices:", error);
        setStatus(`Error fetching prices. Check server.`);
      })
      .finally(() => setLoading(false));
  };
  
  const askAI = () => { /* ... (omitted askAI logic for brevity) ... */ };

  const startOver = () => {
    setStage('crop_selection');
    setSelectedCrop('');
    setPrices([]);
    setPnlData(null); 
    setStatus('Select a crop to begin.');
  };
  
  const handlePnlCropSelect = (cropName) => {
    setSelectedCrop(cropName);
    fetchPnlAnalysis(cropName);
  };


  // --- UI Rendering Logic ---
  const renderMarketSection = () => {
    if (loading) { return <ActivityIndicator size="large" color={ACCENT_COLOR} style={appStyles.activityIndicator} />; }

    if (stage === 'crop_selection') {
      return (
        <View>
          <Text style={appStyles.prompt}>1. Please select a crop:</Text>
          <View style={appStyles.buttonContainer}>
            {availableCrops.map(crop => (
              <TouchableOpacity key={crop} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => { setSelectedCrop(crop); setStage('city_selection'); setStatus(`Selected ${crop}. Now fetching prices...`); fetchPrices(crop); }}>
                <Animated.View style={[appStyles.cropButton, { backgroundColor: CROP_COLORS[crop] || '#6c757d', transform: [{ scale: scaleAnim }] }]}>
                  <Text style={appStyles.cropButtonText}>{crop}</Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    
    if (stage === 'final_prices' && prices.length > 0) {
      const bestMandi = prices.reduce((best, current) => { return current.price > best.price ? current : best; }, { price: -1, mandi: 'N/A' }); 
      const chartData = { labels: prices.map(p => p.mandi.split('(')[0].trim()), datasets: [{ data: prices.map(p => p.price), color: (opacity = 1) => CROP_COLORS[selectedCrop] || `rgba(40, 167, 69, ${opacity})`, }] };
      const chartConfig = { backgroundGradientFrom: SECONDARY_CARD, backgroundGradientTo: '#3a3a5a', decimalPlaces: 2, color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, style: { borderRadius: 8 }, propsForDots: { r: "4", strokeWidth: "2", stroke: CROP_COLORS[selectedCrop] || ACCENT_COLOR }, propsForLabels: { fontSize: 10, }, yAxisLabel: RUPEE_SYMBOL, yAxisLabelCount: 5, };

      return (
        <Animated.View style={{ opacity: opacityAnim }}> 
            <View style={appStyles.recommendationBox}>
                <Text style={appStyles.recommendationHeader}>🏆 Best Mandi to Sell:</Text>
                <Text style={appStyles.recommendationText}>{bestMandi.mandi} at {RUPEE_SYMBOL}{bestMandi.price.toFixed(2)}/kg</Text>
            </View>
          
            <LineChart data={chartData} width={screenWidth - 50} height={220} chartConfig={chartConfig} bezier style={appStyles.chartStyle} />

            <Text style={appStyles.promptPrices}>Prices and Trends for {selectedCrop}:</Text>
            <View style={appStyles.priceList}>
            {prices.map((price, index) => (
              <View key={index} style={appStyles.priceItemRow}>
                <Text style={appStyles.cityText}>{price.mandi}</Text>
                <View style={appStyles.priceInfoContainer}> 
                    <Text style={[appStyles.priceText, { color: CROP_COLORS[selectedCrop] || ACCENT_COLOR, fontWeight: 'bold' }]}> {RUPEE_SYMBOL}{price.price.toFixed(2)}/kg </Text>
                    <Text style={[appStyles.trendText, { color: price.trend.includes('Up') ? ACCENT_COLOR : price.trend.includes('Down') ? '#FF6347' : TEXT_COLOR }]}> ({price.trend}) </Text>
                </View>
              </View>
            ))}
            </View>
            <Button title="<< Select New Crop" onPress={startOver} color="#6c757d" />
        </Animated.View>
      );
    }
    return <Text style={appStyles.noData}>Select a crop to begin.</Text>;
  };


  // --- Render Demand Forecast Section ---
  const renderDemandSection = () => {
    return (
        <View style={[appStyles.section, appStyles.demandSectionBorder]}>
            <Text style={appStyles.subHeader}>Demand Forecast (Next Season)</Text>
            
            <Text style={appStyles.prompt}>3. Select your region to plan your next planting cycle:</Text>
            
            {/* Display Regional Buttons */}
            <View style={appStyles.buttonContainer}>
                {MANDI_LIST.map(mandi => (
                    <TouchableOpacity
                        key={mandi}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => fetchAndDisplayDemandForecast(mandi)} 
                    >
                        <Animated.View
                            style={[
                                appStyles.cropButton, 
                                { 
                                    backgroundColor: demandSelectedMandi === mandi ? ACCENT_COLOR : CROP_COLORS['Rice'], // Highlight selected
                                    transform: [{ scale: scaleAnim }] 
                                }
                            ]}
                        >
                            <Text style={appStyles.cropButtonText}>{mandi.split('(')[0].trim()}</Text>
                        </Animated.View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Display Forecast Results */}
            <ForecastResultDisplay forecastData={demandForecastData} onClose={() => setDemandForecastData(null)} styles={appStyles} />

        </View>
    );
  };


  // --- Main Render ---
  return (
    <ScrollView contentContainerStyle={appStyles.scrollContainer} style={appStyles.container}>
        <PnlDrillDownModal isVisible={pnlVisible} onClose={() => setPnlVisible(false)} pnlData={pnlData} selectedCrop={selectedCrop} styles={appStyles} />

        <Text style={appStyles.header}>AGRIVERSE AI</Text> 
        <Text style={[appStyles.status, { color: ACCENT_COLOR }]}>{status}</Text> 
        
        {/* 1. Market Prices Section */}
        <View style={[appStyles.section, appStyles.marketSectionBorder]}>
            <Text style={appStyles.subHeader}>Market Intelligence ({selectedCrop || 'Selection'})</Text>
            {renderMarketSection()}
        </View>
        
        {/* 2. Profit & Loss Analysis Section */}
        <View style={[appStyles.section, appStyles.pnlSectionBorder]}>
            <Text style={appStyles.subHeader}>Profit & Loss Analysis</Text>
            
            <View>
                <Text style={appStyles.prompt}>2. Select crop for P&L breakdown:</Text>
                <View style={appStyles.buttonContainer}>
                    {availableCrops.map(crop => (
                    <TouchableOpacity key={crop} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => handlePnlCropSelect(crop)}>
                        <Animated.View style={[appStyles.cropButton, { backgroundColor: CROP_COLORS[crop] || '#6c757d', transform: [{ scale: scaleAnim }] }]}>
                        <Text style={appStyles.cropButtonText}>{crop}</Text>
                        </Animated.View>
                    </TouchableOpacity>
                    ))}
                </View>
            </View>
            
            <Text style={appStyles.pnlPrompt}>Tap a crop button above to view detailed P&L analysis (Graph and Breakdown).</Text>
        </View>
        
        {/* 3. NEW: Demand Forecast Section */}
        {renderDemandSection()}

        {/* 4. Financial Assistant Section */}
        <View style={appStyles.section}>
            <Text style={appStyles.subHeader}>Financial Assistant (GPT)</Text>
            <TextInput
                style={appStyles.input}
                placeholder="Ask about loans, subsidies, crop insurance, etc."
                onChangeText={t => { /* ... */ }} 
                value={question}
                multiline
                placeholderTextColor="#999" 
            />
            <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={askAI}>
                <Animated.View style={[appStyles.aiButtonWrapper, { transform: [{ scale: scaleAnim }] }]}>
                    <Button title="ASK AI" onPress={askAI} color="transparent" /> 
                </Animated.View>
            </TouchableOpacity>
            
            {answer ? (
                <View style={appStyles.answerBox}>
                    <Text style={appStyles.answerHeader}>AI Response:</Text>
                    <Text style={appStyles.answer}>{answer}</Text>
                </View>
            ) : null}
        </View>
    </ScrollView>
  );
}

// --- STYLESHEET DEFINITIONS (FINAL, ISOLATED) ---

// Define the main styles for the app layout
const appStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY_DARK }, 
  scrollContainer: { padding: 20, paddingTop: 60, paddingBottom: 50 },
  header: { fontSize: 34, fontWeight: "900", textAlign: "center", marginBottom: 8, color: '#00FFFF', textShadowColor: 'rgba(0, 255, 255, 0.7)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10, },
  status: { textAlign: "center", marginBottom: 30, fontSize: 16, fontStyle: 'italic' }, 
  
  // Section Card Style
  section: { 
    marginBottom: 30, 
    padding: 20, 
    backgroundColor: SECONDARY_CARD, 
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#4a4a70', 
    shadowColor: '#00FFFF', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10, 
  },
  // Highlight Border for Market Section
  marketSectionBorder: {
      borderColor: ACCENT_COLOR,
      borderWidth: 2,
      shadowColor: ACCENT_COLOR,
      shadowOpacity: 0.5,
  },
  subHeader: { fontSize: 22, fontWeight: "700", marginBottom: 15, color: TEXT_COLOR }, 
  
  // Input and Button Styles
  input: { borderWidth: 2, borderColor: '#5a5a8a', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: PRIMARY_DARK, minHeight: 50, fontSize: 16, color: TEXT_COLOR, }, 
  aiButtonWrapper: { backgroundColor: '#1E90FF', borderRadius: 8, overflow: 'hidden', marginBottom: 15, },
  
  // PNL Feature Styles
  pnlSectionBorder: { borderLeftWidth: 5, borderLeftColor: WARNING_COLOR, },
  pnlPrompt: { fontSize: 16, color: '#A0A0A0', marginBottom: 15 },
  prompt: { fontSize: 18, marginBottom: 15, fontWeight: '600', color: TEXT_COLOR },
  promptPrices: { fontSize: 16, marginBottom: 10, fontWeight: 'bold', color: TEXT_COLOR },
  
  // Demand Forecast Base Styles
  demandSectionBorder: { borderColor: '#00FFFF', borderWidth: 2, shadowColor: '#00FFFF', shadowOpacity: 0.5, }, 
  demandPrompt: { fontSize: 16, color: TEXT_COLOR, marginBottom: 15 }, 

  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 20 },
  cropButton: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, margin: 4, minWidth: 100, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 5, },
  cropButtonText: { color: PRIMARY_DARK, fontWeight: '800', fontSize: 16 }, 
  priceList: { marginTop: 10, marginBottom: 20, borderTopWidth: 1, borderTopColor: '#4a4a70' }, 
  priceItemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#4a4a70' }, 
  cityText: { fontSize: 16, color: TEXT_COLOR, fontWeight: '500' },
  priceInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  priceText: { fontSize: 16, fontWeight: 'bold', marginRight: 5 }, 
  trendText: { marginLeft: 5, fontSize: 13, fontWeight: '600', textShadowColor: '#000', textShadowRadius: 1 }, 
  recommendationBox: { backgroundColor: '#3a3a5a', padding: 15, borderRadius: 10, borderLeftWidth: 5, borderLeftColor: ACCENT_COLOR, marginBottom: 25, alignItems: 'flex-start', },
  recommendationHeader: { fontWeight: '900', color: ACCENT_COLOR, fontSize: 17, marginBottom: 5, },
  recommendationText: { fontSize: 18, fontWeight: '800', color: TEXT_COLOR, },
  chartStyle: { marginLeft: -15, borderRadius: 12, borderWidth: 1, borderColor: '#4a4a70', paddingRight: 20, paddingLeft: 45, paddingBottom: 0, marginVertical: 10, },
  answerBox: { marginTop: 15, backgroundColor: "#3a3a5a", borderLeftWidth: 4, borderLeftColor: ACCENT_COLOR, padding: 15, borderRadius: 8, }, 
  answerHeader: { fontWeight: "bold", marginBottom: 5, color: ACCENT_COLOR }, 
  answer: { fontSize: 15, color: TEXT_COLOR },
  noData: { fontSize: 14, color: '#A0A0A0', fontStyle: 'italic', marginTop: 5 },
  
  // Demand Forecast Result Styles
  forecastResultContainer: { 
      paddingVertical: 10, 
      marginTop: 5, 
      backgroundColor: SECONDARY_CARD,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#4a4a70',
      paddingBottom: 20,
  },
  forecastResultHeader: {
      fontSize: 18,
      fontWeight: '700',
      color: TEXT_COLOR,
      marginBottom: 10,
      paddingHorizontal: 10,
  },
  forecastPrimaryBox: {
      backgroundColor: PRIMARY_DARK,
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      borderLeftWidth: 4,
      borderLeftColor: ACCENT_COLOR,
      marginHorizontal: 10,
  },
  forecastPrimaryText: { fontSize: 14, color: ACCENT_COLOR, fontWeight: '600' },
  forecastPrimaryCrop: { fontSize: 20, fontWeight: 'bold', marginTop: 3 },
  forecastReasonText: { fontSize: 14, color: TEXT_COLOR, marginHorizontal: 10, marginBottom: 5 },
  forecastDivider: { borderBottomWidth: 1, borderBottomColor: '#4a4a70', marginVertical: 10, marginHorizontal: 10 },
  forecastSecondaryHeader: { fontSize: 16, fontWeight: 'bold', color: TEXT_COLOR, marginHorizontal: 10, marginBottom: 5 },
  forecastSecondaryItem: { paddingVertical: 5, marginHorizontal: 10 },
  forecastSecondaryText: { fontSize: 14, color: TEXT_COLOR },

  // Modal Styling (PNL Modal Styles)
    modalCenteredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0, 0, 0, 0.8)', },
    modalView: { width: screenWidth * 0.9, maxHeight: screenWidth * 1.5, backgroundColor: SECONDARY_CARD, borderRadius: 20, padding: 25, shadowColor: ACCENT_COLOR, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 20, borderWidth: 2, borderColor: ACCENT_COLOR, },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#00FFFF', marginBottom: 15, textAlign: 'center', },
    modalMetricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, padding: 10, backgroundColor: PRIMARY_DARK, borderRadius: 8, }, 
    modalMetricBox: { fontSize: 16, color: ACCENT_COLOR, fontWeight: 'bold' },
    modalScoreText: { fontSize: 18, color: TEXT_COLOR, fontWeight: '600', marginBottom: 10, },
    modalAdviceText: { fontSize: 16, color: '#A0A0A0', marginBottom: 20, fontStyle: 'italic', },
    modalTableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: ACCENT_COLOR, paddingBottom: 8, marginBottom: 5, },
    modalHeaderText: { color: ACCENT_COLOR, fontWeight: 'bold', fontSize: 14, textAlign: 'left', },
    modalTableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#4a4a70', alignItems: 'center', },
    modalRowText: { color: TEXT_COLOR, fontSize: 14, textAlign: 'left', },
    modalCommentText: { color: TEXT_COLOR, fontSize: 14, },
    modalTapToLearnText: { color: '#00FFFF', fontWeight: 'bold', textDecorationLine: 'underline', },
    modalScrollView: { marginBottom: 20, },
});