import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import json
import random

# --- 1. Create the FastAPI application object ---
app = FastAPI()

# --- 2. CORS Configuration (Remains the same) ---
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------------------------------------------

# --- 3. Initialize OpenAI Client ---
try:
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable not set.")
    
    openai_client = OpenAI(api_key=OPENAI_API_KEY) 
except Exception as e:
    print("WARNING: OPENAI_API_KEY not found. Using mock AI response.")
    openai_client = None


# --- 4. Define Mock Data Functions ---

# --- FIXED BASE PRICES PER 1 KG ---
CROP_DATA_MAP_PER_KG = {
    "tomato": 42.0, "onion": 30.0, "wheat": 22.50, "rice": 33.00, "chilli": 91.00, 
    "cotton": 63.00, "potato": 18.0, "maize": 19.80, "mustard": 55.00, "soybean": 48.00, 
    "coffee": 230.00, "sugarcane": 3.25, 
}

# Mandi list and associated FIXED RUPEE DEVIATION (11 total)
MANDI_DEVIATIONS_KG = [
    {"mandi": "Lucknow (UP)", "change": 0.50, "trend": "+0.8% (Up)"},
    {"mandi": "Ludhiana (PB)", "change": -0.30, "trend": "-1.2% (Down)"},
    {"mandi": "Indore (MP)", "change": 0.80, "trend": "+2.5% (Up)"},
    {"mandi": "Kolkata (WB)", "change": 0.00, "trend": "Stable"},
    {"mandi": "Guntur (AP)", "change": -0.50, "trend": "-2.0% (Down)"},
    {"mandi": "Jaipur (RJ)", "change": 0.20, "trend": "+0.8% (Up)"},
    {"mandi": "Bengaluru (KA)", "change": 1.00, "trend": "+3.0% (Up)"},
    {"mandi": "Rajkot (GJ)", "change": -1.00, "trend": "-3.0% (Down)"},
    {"mandi": "Karnal (HR)", "change": 0.10, "trend": "+0.5% (Up)"},
    {"mandi": "Pune (MH)", "change": 0.60, "trend": "+2.0% (Up)"},
    {"mandi": "Chennai (TN)", "change": 0.50, "trend": "+0.8% (Up)"},
]

def create_static_predictions(crop_name):
    """Generates verifiable static predictions using stable KG units."""
    
    crop = crop_name.lower()
    if crop not in CROP_DATA_MAP_PER_KG:
        return None, None
        
    base_price_per_kg = CROP_DATA_MAP_PER_KG[crop]
    predictions = []
    
    for data in MANDI_DEVIATIONS_KG:
        rupee_change_per_kg = data["change"]
        
        price = base_price_per_kg + rupee_change_per_kg
        
        price = round(price, 2)
        
        predictions.append({
            "mandi": data["mandi"], 
            "price": price,
            "trend": data["trend"]
        })
        
    return {"crop": crop_name.title(), "predictions": predictions}


# --- 5. API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Agriverse API"}

@app.get("/market-prices/{crop_name}") 
def get_market_prices(crop_name: str):
    data = create_static_predictions(crop_name)
    if data and "error" not in data: return data
    else: return {"error": f"Price data not found for crop: {crop_name}"}

# --- NEW: Demand Forecast Endpoint ---
@app.get("/demand-forecast/{state_mandi}")
def get_demand_forecast(state_mandi: str):
    
    mandi = state_mandi.lower()
    
    forecasts = {
        "lucknow (up)": ["Wheat", "Mustard", "Maize"],
        "ludhiana (pb)": ["Wheat", "Cotton", "Maize"],
        "karnal (hr)": ["Wheat", "Mustard", "Soybean"],
        "indore (mp)": ["Soybean", "Maize", "Chilli"],
        "rajkot (gj)": ["Cotton", "Groundnut (Mock)", "Soybean"],
        "pune (mh)": ["Onion", "Sugarcane", "Tomato"],
        "guntur (ap)": ["Chilli", "Rice", "Cotton"],
        "bengaluru (ka)": ["Coffee", "Tomato", "Rice"],
        "chennai (tn)": ["Rice", "Tomato", "Coffee"],
        "kolkata (wb)": ["Rice", "Potato", "Tomato"],
        "jaipur (rj)": ["Mustard", "Wheat", "Soybean"],
        "default": ["Soybean", "Maize", "Tomato"]
    }
    
    top_crops = forecasts.get(mandi, forecasts['default'])
    
    return {
        "mandi": state_mandi,
        "recommendations": [
            {
                "crop": top_crops[0],
                "score": 95,
                "reason": "High demand projected due to seasonal consumption and low carry-over stock.",
                "type": "Primary (High Demand)"
            },
            {
                "crop": top_crops[1],
                "score": 88,
                "reason": "Strong export interest and favorable government policy outlook.",
                "type": "Secondary (Stable Demand)"
            },
            {
                "crop": top_crops[2],
                "score": 75,
                "reason": "Stable commodity, but high local competition may limit profit margins.",
                "type": "Tertiary (Stable)"
            }
        ]
    }


# --- PNL Analysis Endpoint ---
@app.get("/pnl-analysis/calculate")
def calculate_pnl(
    crop: str = Query(..., description="Crop name"),
    yield_qty: float = Query(50.0, alias="yield", description="Mock yield in quintals/acre"), 
    expected_price: float = Query(35.0, alias="expectedPrice", description="Mock expected sale price per kg"), 
    fertilizer: float = Query(5000.0, description="Mock cost of fertilizer"),
    pesticide: float = Query(500.0, description="Mock cost of pesticide"),
    labour: float = Query(5000.0, description="Mock cost of labour"),
    other: float = Query(1000.0, description="Mock other operating costs"),
):
    
    # 1. CALCULATE TOTAL REVENUE AND COST
    total_yield_kg = yield_qty * 100 
    expected_revenue = total_yield_kg * expected_price
    total_cost = fertilizer + pesticide + labour + other
    net_profit = expected_revenue - total_cost

    # 2. GENERATE STATIC P&L BREAKDOWN (remains the same)
    reasons = [
        {"factor": "Market Price Risk", "impact": "+10", "comment": f"Your target price of ₹{expected_price:.2f}/kg is achievable in high-demand mandis.", "ai_context": "The highest mock price is ₹XX.XX/kg, showing your target is realistic but not guaranteed across all regions."},
        {"factor": "Weather Risk", "impact": "+8", "comment": "Good rainfall forecast for primary regions.", "ai_context": "Local weather models predict ideal rainfall during the maturity phase. This reduces risk."},
        {"factor": "Transportation Cost", "impact": "+4", "comment": "Low cost due to proximity to the mandi.", "ai_context": f"Your transport cost saving is estimated at ₹{total_cost * 0.01:.2f} per quintal compared to average rates."},
        {"factor": "Regional Supply", "impact": "-5", "comment": "More farmers growing this crop in the region.", "ai_context": "APMC data indicates a 15% increase in local planting acreage, which may slightly suppress prices."},
        {"factor": "Input Cost (Fertilizer/Labor)", "impact": "-3", "comment": "Fertilizer (Urea) prices increased by 6% this quarter.", "ai_context": "Government data shows fertilizer subsidy has not kept pace with the 6% global commodity price increase, reducing profit margins."},
    ]
    
    # 3. DETERMINE NET IMPACT SCORE (Corrected Logic)
    net_impact = sum(int(reason["impact"].replace('+', '')) for reason in reasons)

    return {
        "crop": crop.title(),
        "net_impact_score": net_impact,
        "advice": f"Your Net Profit Margin is calculated at ₹{net_profit:.2f}. Focus on optimal storage and grading to achieve your target price.",
        "reasons": reasons,
        "total_cost": total_cost,          
        "expected_revenue": expected_revenue 
    }


@app.get("/ask-assistant")
def ask_assistant(question: str):
    if openai_client:
        try:
            # Logic to call the real OpenAI API
            system_prompt = "You are a helpful financial advisor specializing in Indian agriculture subsidies, loans (KCC, NABARD), and crop insurance. Answer the user's question simply and clearly in less than 100 words."
            
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question},
                ],
                max_tokens=300,
            )
            
            return {"answer": response.choices[0].message.content}
            
        except Exception as e:
            return {"answer": "Error: Could not connect to the AI model. Check API key."}
    else:
        # Mock fallback logic
        if "loan" in question.lower():
             return {"answer": "MOCK: Apply for agricultural loans through local banks."}
        return {"answer": "MOCK: Please set the OPENAI_API_KEY in Render to activate the real AI."}