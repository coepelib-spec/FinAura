import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Initialize the App
app = FastAPI(title="FinAura Backend")

# --- CORS CONFIGURATION (Crucial for Web) ---
# Allows your React frontend to talk to this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA LOADER ---
# Loads the mock data to simulate a database connection
def get_mock_data():
    try:
        with open('mock_data.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "mock_data.json not found"}

data = get_mock_data()

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "user_558"

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"status": "FinAura API is running", "team": "Team Matricole"}

@app.get("/dashboard")
def get_dashboard_metrics():
    """
    Implements the 'Will I Be Broke?' Engine.
    Calculates Safe-to-Spend based on balance and days left.
    """
    user = data['user_profile']
    
    # LOGIC: (Current Balance / Days Left) * 0.8 Safety Buffer
    # This prevents users from hitting exactly 0 before month end
    daily_safe_limit = (user['current_balance'] / user['days_left_in_month']) * 0.8
    
    # FILTER: Find 'Vampire Subscriptions' (Unused)
    unused_subs = [sub for sub in data['subscriptions'] if sub['status'] == 'unused']
    
    return {
        "user_name": user['name'],
        "spending_dna": user['spending_dna'],
        "balance": user['current_balance'],
        "safe_to_spend_daily": int(daily_safe_limit),
        "days_left": user['days_left_in_month'],
        "vampire_subscriptions": unused_subs
    }

@app.post("/chat")
def chat_with_therapist(request: ChatRequest):
    """
    Implements the 'Financial Therapist' Persona.
    Uses keyword detection to mock an AI response for the demo.
    """
    user_input = request.message.lower()
    
    # SCENARIO 1: Impulse Buying (The "Stop!!" Intervention)
    if "shoes" in user_input or "buy" in user_input:
        # Behavioral Economics: Translate cost to 'Work Hours'
        return {
            "response": "🛑 Hold on! Those shoes cost ₹3000. That is roughly 26 hours of your internship work. Is this a need, or is your 'Impulsive Socializer' DNA kicking in? Wait 24 hours.",
            "intent": "intervention"
        }
    
    # SCENARIO 2: Financial Anxiety
    elif "broke" in user_input or "worried" in user_input:
        return {
            "response": "I get it, money is stressful. But looking at your data, you have ₹4200 left. If you stick to ₹280/day, you will make it to the end of the month comfortably. You got this.",
            "intent": "comfort"
        }
    
    # SCENARIO 3: Roommate/Splitting Bills
    elif "owe" in user_input or "split" in user_input:
        return {
            "response": "I've added that to the 'Roommate OS' ledger. I'll remind Rahul to pay his share of the electricity bill on Friday so you don't have to have that awkward conversation.",
            "intent": "utility"
        }

    # DEFAULT FALLBACK
    else:
        return {
            "response": "I'm listening. I'm here to help you manage your money without the judgment. What's on your mind?",
            "intent": "general"
        }

@app.post("/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    """
    Mock OCR Endpoint. 
    Always returns a successful scan of a pizza receipt for the demo.
    """
    return {
        "merchant": "Domino's Pizza",
        "date": "2025-12-25",
        "total": 450.00,
        "items": ["Farmhouse Pizza", "Coke Zero"],
        "category": "Food",
        "detected_emotion": "Hungry" 
    }

# To run: uvicorn main:app --reload
  
