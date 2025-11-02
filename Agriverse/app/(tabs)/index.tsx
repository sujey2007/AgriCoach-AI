import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// API_URL is now correctly set to your computer's IP address
const API_URL = 'http://192.168.1.18:8000';

export default function App() {
  const [prices, setPrices] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('Welcome! Press "Get Latest Prices" to start.');

  // --- Functions to Interact with Your Python Backend ---

  const fetchPrices = () => {
    setStatus('Fetching market prices...');
    fetch(`${API_URL}/market-prices`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // The mock data is expected to be under a 'predictions' key
        setPrices(data.predictions || []);
        setStatus('Prices updated!');
      })
      .catch(error => {
        console.error("Error fetching prices:", error);
        setStatus(`Error fetching prices. Is the server running at ${API_URL}?`);
      });
  };

  const askAI = () => {
    if (!question.trim()) return;
    setStatus('Asking AI assistant...');
    setAnswer('');
    
    // Encode the question to be safely used in a URL
    fetch(`${API_URL}/ask-assistant?question=${encodeURIComponent(question)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // The AI answer is expected to be under an 'answer' key
        setAnswer(data.answer);
        setStatus('Got an answer!');
      })
      .catch(error => {
        console.error("Error asking AI:", error);
        setStatus('Error asking AI. Check your server and network connection.');
      });
  };
  
  // --- UI Layout ---

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Agriverse Assistant</Text>
      <Text style={styles.status}>{status}</Text>
      
      {/* Market Prices Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Market Prices (Mock Data)</Text>
        <Button title="Get Latest Prices" onPress={fetchPrices} color="#28a745" />
        <View style={styles.priceList}>
          {prices.length > 0 ? (
            prices.map((price, index) => (
              <Text key={index} style={styles.priceItem}>
                {price.mandi}: **₹{price.price}** (per unit)
              </Text>
            ))
          ) : (
            <Text style={styles.noData}>No price data yet. Tap the button!</Text>
          )}
        </View>
      </View>
      
      {/* Financial Assistant Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Financial Assistant (AI)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ask about loans, subsidies, crop insurance, etc."
          onChangeText={setQuestion}
          value={question}
          multiline
          placeholderTextColor="#888"
        />
        <Button title="Ask AI" onPress={askAI} color="#007bff" />
        
        {answer ? (
          <View style={styles.answerBox}>
            <Text style={styles.answerHeader}>AI Response:</Text>
            <Text style={styles.answer}>{answer}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

// --- Styling ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#343a40',
  },
  status: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
    fontSize: 14,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#343a40',
  },
  priceList: {
    marginTop: 10,
  },
  priceItem: {  // <-- This was the start of the 'priceItem' block that was cut off
    fontSize: 16,
    paddingVertical: 5,
    color: '#212529',
  },
  noData: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  answerBox: {
    marginTop: 15,
    backgroundColor: '#e6ffed',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  answerHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#28a745',
  },
  answer: {
    fontSize: 15,
    color: '#212529',
  },
});