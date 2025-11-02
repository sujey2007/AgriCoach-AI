import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
import random

# Import the Google library
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Initialize the FastAPI app
app = FastAPI()

# State variable to hold the AI client
generative_model = None

# FastAPI Startup Event
@app.on_event("startup")
def startup_event():
    global generative_model
    try:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        
        genai.configure(api_key=api_key)
        # Using the latest stable model name
        generative_model = genai.GenerativeModel('gemini-2.0-flash')
        print("INFO:     Google Gemini client initialized successfully.")
    except Exception as e:
        print(f"WARNING:  {e}. Using mock AI response.")
        generative_model = None

# CORS Configuration
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Define Mock Data Functions ---

CROP_DATA_MAP_PER_KG = { "tomato": 42.0, "onion": 30.0, "wheat": 22.50, "rice": 33.00, "chilli": 91.00, "cotton": 63.00, "potato": 18.0, "maize": 19.80, "mustard": 55.00, "soybean": 48.00, "coffee": 230.00, "sugarcane": 3.25 }

MANDI_DEVIATIONS_KG = [ {"mandi": "Lucknow (UP)", "change": 0.50, "trend": "+0.8% (Up)"}, {"mandi": "Ludhiana (PB)", "change": -0.30, "trend": "-1.2% (Down)"}, {"mandi": "Indore (MP)", "change": 0.80, "trend": "+2.5% (Up)"}, {"mandi": "Kolkata (WB)", "change": 0.00, "trend": "Stable"}, {"mandi": "Guntur (AP)", "change": -0.50, "trend": "-2.0% (Down)"}, {"mandi": "Jaipur (RJ)", "change": 0.20, "trend": "+0.8% (Up)"}, {"mandi": "Bengaluru (KA)", "change": 1.00, "trend": "+3.0% (Up)"}, {"mandi": "Rajkot (GJ)", "change": -1.00, "trend": "-3.0% (Down)"}, {"mandi": "Karnal (HR)", "change": 0.10, "trend": "+0.5% (Up)"}, {"mandi": "Pune (MH)", "change": 0.60, "trend": "+2.0% (Up)"}, {"mandi": "Chennai (TN)", "change": 0.50, "trend": "+0.8% (Up)"} ]

# --- CORRECTED: Expanded mock weather data for all regions ---
WEATHER_DATA = {
    "chennai (tn)": {"location": "Chennai", "current": {"temp_c": 31, "condition": "Partly Cloudy", "humidity": "78%"}, "forecast": [{"day": "Tomorrow", "high_c": 32, "low_c": 26, "condition": "Light Rain"}, {"day": "Overmorrow", "high_c": 33, "low_c": 27, "condition": "Sunny"}, {"day": "Next Day", "high_c": 32, "low_c": 26, "condition": "Thunderstorms"}]},
    "lucknow (up)": {"location": "Lucknow", "current": {"temp_c": 28, "condition": "Sunny", "humidity": "65%"}, "forecast": [{"day": "Tomorrow", "high_c": 29, "low_c": 18, "condition": "Clear"}, {"day": "Overmorrow", "high_c": 30, "low_c": 19, "condition": "Sunny"}, {"day": "Next Day", "high_c": 31, "low_c": 20, "condition": "Hazy"}]},
    "pune (mh)": {"location": "Pune", "current": {"temp_c": 25, "condition": "Cloudy", "humidity": "85%"}, "forecast": [{"day": "Tomorrow", "high_c": 26, "low_c": 21, "condition": "Showers"}, {"day": "Overmorrow", "high_c": 27, "low_c": 22, "condition": "Light Rain"}, {"day": "Next Day", "high_c": 28, "low_c": 22, "condition": "Partly Cloudy"}]},
    "bengaluru (ka)": {"location": "Bengaluru", "current": {"temp_c": 24, "condition": "Drizzle", "humidity": "90%"}, "forecast": [{"day": "Tomorrow", "high_c": 25, "low_c": 20, "condition": "Rain"}, {"day": "Overmorrow", "high_c": 26, "low_c": 21, "condition": "Showers"}, {"day": "Next Day", "high_c": 27, "low_c": 21, "condition": "Cloudy"}]},
    "indore (mp)": {"location": "Indore", "current": {"temp_c": 27, "condition": "Clear Sky", "humidity": "70%"}, "forecast": [{"day": "Tomorrow", "high_c": 28, "low_c": 19, "condition": "Sunny"}, {"day": "Overmorrow", "high_c": 29, "low_c": 20, "condition": "Clear"}, {"day": "Next Day", "high_c": 30, "low_c": 21, "condition": "Partly Cloudy"}]},
    "ludhiana (pb)": {"location": "Ludhiana", "current": {"temp_c": 26, "condition": "Haze", "humidity": "60%"}, "forecast": [{"day": "Tomorrow", "high_c": 28, "low_c": 17, "condition": "Sunny"}, {"day": "Overmorrow", "high_c": 29, "low_c": 18, "condition": "Clear"}, {"day": "Next Day", "high_c": 30, "low_c": 19, "condition": "Haze"}]},
    "kolkata (wb)": {"location": "Kolkata", "current": {"temp_c": 30, "condition": "Humid", "humidity": "88%"}, "forecast": [{"day": "Tomorrow", "high_c": 31, "low_c": 25, "condition": "Showers"}, {"day": "Overmorrow", "high_c": 32, "low_c": 26, "condition": "Thunderstorms"}, {"day": "Next Day", "high_c": 32, "low_c": 26, "condition": "Rain"}]},
    "guntur (ap)": {"location": "Guntur", "current": {"temp_c": 32, "condition": "Sunny", "humidity": "75%"}, "forecast": [{"day": "Tomorrow", "high_c": 33, "low_c": 26, "condition": "Partly Cloudy"}, {"day": "Overmorrow", "high_c": 34, "low_c": 27, "condition": "Sunny"}, {"day": "Next Day", "high_c": 33, "low_c": 27, "condition": "Clear"}]},
    "jaipur (rj)": {"location": "Jaipur", "current": {"temp_c": 29, "condition": "Clear", "humidity": "55%"}, "forecast": [{"day": "Tomorrow", "high_c": 30, "low_c": 20, "condition": "Sunny"}, {"day": "Overmorrow", "high_c": 31, "low_c": 21, "condition": "Clear"}, {"day": "Next Day", "high_c": 32, "low_c": 22, "condition": "Sunny"}]},
    "rajkot (gj)": {"location": "Rajkot", "current": {"temp_c": 30, "condition": "Sunny", "humidity": "65%"}, "forecast": [{"day": "Tomorrow", "high_c": 31, "low_c": 22, "condition": "Clear"}, {"day": "Overmorrow", "high_c": 32, "low_c": 23, "condition": "Sunny"}, {"day": "Next Day", "high_c": 33, "low_c": 24, "condition": "Clear"}]},
    "karnal (hr)": {"location": "Karnal", "current": {"temp_c": 27, "condition": "Hazy Sun", "humidity": "62%"}, "forecast": [{"day": "Tomorrow", "high_c": 29, "low_c": 18, "condition": "Sunny"}, {"day": "Overmorrow", "high_c": 30, "low_c": 19, "condition": "Clear"}, {"day": "Next Day", "high_c": 31, "low_c": 20, "condition": "Haze"}]}
}

def create_static_predictions(crop_name):
    # ... (this function remains unchanged)
    crop = crop_name.lower()
    if crop not in CROP_DATA_MAP_PER_KG: return None
    base_price_per_kg = CROP_DATA_MAP_PER_KG[crop]
    predictions = [{"mandi": data["mandi"], "price": round(base_price_per_kg + data["change"], 2), "trend": data["trend"]} for data in MANDI_DEVIATIONS_KG]
    return {"crop": crop_name.title(), "predictions": predictions}

# --- API Endpoints ---
@app.get("/")
def read_root(): return {"message": "Welcome to the Agriverse API"}

@app.get("/market-prices/{crop_name}")
def get_market_prices(crop_name: str):
    data = create_static_predictions(crop_name)
    return data if data else {"error": f"Price data not found for crop: {crop_name}"}

@app.get("/demand-forecast/{state_mandi}")
def get_demand_forecast(state_mandi: str):
    # ... (this function remains unchanged)
    mandi = state_mandi.lower()
    forecasts = { "lucknow (up)": ["Wheat", "Mustard", "Maize"], "ludhiana (pb)": ["Wheat", "Cotton", "Maize"], "karnal (hr)": ["Wheat", "Mustard", "Soybean"], "indore (mp)": ["Soybean", "Maize", "Chilli"], "rajkot (gj)": ["Cotton", "Groundnut (Mock)", "Soybean"], "pune (mh)": ["Onion", "Sugarcane", "Tomato"], "guntur (ap)": ["Chilli", "Rice", "Cotton"], "bengaluru (ka)": ["Coffee", "Tomato", "Rice"], "chennai (tn)": ["Rice", "Tomato", "Coffee"], "kolkata (wb)": ["Rice", "Potato", "Tomato"], "jaipur (rj)": ["Mustard", "Wheat", "Soybean"], "default": ["Soybean", "Maize", "Tomato"] }
    top_crops = forecasts.get(mandi, forecasts['default'])
    return { "mandi": state_mandi, "recommendations": [ {"crop": top_crops[0], "score": 95, "reason": "..."}, {"crop": top_crops[1], "score": 88, "reason": "..."}, {"crop": top_crops[2], "score": 75, "reason": "..."} ] }

@app.get("/pnl-analysis/calculate")
def calculate_pnl(crop: str = Query(...), yield_qty: float = Query(50.0, alias="yield"), expected_price: float = Query(35.0, alias="expectedPrice"), fertilizer: float = Query(5000.0), pesticide: float = Query(500.0), labour: float = Query(5000.0), other: float = Query(1000.0)):
    # ... (this function remains unchanged)
    expected_revenue = (yield_qty * 100) * expected_price
    total_cost = fertilizer + pesticide + labour + other
    net_profit = expected_revenue - total_cost
    reasons = [ {"factor": "Market Risk", "impact": "+10", "comment": f"..."}, {"factor": "Weather", "impact": "+8", "comment": "..."}, {"factor": "Transport", "impact": "+4", "comment": "..."}, {"factor": "Supply", "impact": "-5", "comment": "..."}, {"factor": "Input Cost", "impact": "-3", "comment": "..."} ]
    net_impact = sum(int(reason["impact"]) for reason in reasons)
    return { "crop": crop.title(), "net_impact_score": net_impact, "advice": f"Net Profit is calculated at ₹{net_profit:,.2f}.", "reasons": reasons, "total_cost": total_cost, "expected_revenue": expected_revenue }

# --- CORRECTED: This endpoint is now fully dynamic ---
@app.get("/weather-forecast")
def get_weather_forecast(region: str = "Chennai (TN)"):
    # Look for the region in our new weather data dictionary, use Chennai as a default
    return WEATHER_DATA.get(region.lower(), WEATHER_DATA["chennai (tn)"])

@app.get("/ask-assistant")
def ask_assistant(question: str):
    # ... (this function remains unchanged)
    if generative_model:
        try:
            prompt = f"You are a helpful financial advisor... Answer this question...: {question}"
            response = generative_model.generate_content(prompt)
            return {"answer": response.text}
        except Exception as e:
            return {"answer": f"Error: Could not connect to the AI model. {e}"}
    else:
        if "loan" in question.lower(): return {"answer": "MOCK: ..."}
        return {"answer": "MOCK: ..."}