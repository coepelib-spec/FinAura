import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA LOADER ---
def get_mock_data():
    try:
        with open('mock_data.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

db = get_mock_data()

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    message: str

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"status": "FinAura Backend Online"}

@app.get("/dashboard")
def get_dashboard():
    """
    Returns all data needed for the Dashboard, Hustle Finder, and Roommate OS.
    """
    user = db['user_profile']
    
    # LOGIC: Safe-to-Spend Calculation
    # Formula: (Balance / Days Left) * 0.8 Safety Factor
    if user['days_left'] > 0:
        safe_limit = (user['current_balance'] / user['days_left']) * 0.8
    else:
        safe_limit = 0

    return {
        "user": user,
        "safe_to_spend": int(safe_limit),
        "gigs": db.get('gig_opportunities', []),
        "roommates": db.get('roommate_ledger', []),
        "unused_sub": db['subscriptions'][0] if db['subscriptions'] else None
    }

@app.post("/chat")
def financial_therapist(req: ChatRequest):
    """
    The AI Brain. Handles Impulse Spending, Stress, and Script Generation.
    """
    msg = req.message.lower()
    user = db['user_profile']
    
    # FEATURE 1: Effort-to-Cost Engine (Impulse Intervention)
    # Trigger: User mentions buying something expensive (e.g., "shoes" or "3000")
    if "buy" in msg or "shoes" in msg or "3000" in msg:
        # Calculate hours of work needed to afford item
        work_hours = 3000 / user['hourly_wage']
        return {
            "response": f"🛑 STOP!! That purchase costs {int(work_hours)} hours of work. Since you're feeling '{user['mood']}', this might be stress-spending. Wait 24 hours?",
            "type": "intervention"
        }
    
    # FEATURE 2: Subscription Stalker (Script Generator)
    # Trigger: User mentions "cancel" or "netflix"
    elif "cancel" in msg or "netflix" in msg:
        return {
            "response": "Generated Script: 'Hi Netflix Support, I am a student auditing my expenses. I haven't used the service in 30 days. Please waive this month's fee and cancel.' Want me to send this?",
            "type": "script"
        }

    # FEATURE 3: Roommate/Bill Splitting
    # Trigger: User mentions "owe" or "split"
    elif "owe" in msg or "split" in msg:
        return {
            "response": "I've updated the Roommate OS ledger. I'll send a polite reminder to Rahul about the electricity bill so you don't have to be the 'bad guy'.",
            "type": "social"
        }

    # Default "Therapist" Response
    else:
        return {
            "response": "I'm listening. I'm here to help you manage your money without the judgment. How are you feeling?",
            "type": "general"
        }

@app.post("/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    """
    Mock OCR Endpoint for the Camera feature.
    """
    return {
        "merchant": "Domino's Pizza",
        "date": "2025-12-25",
        "total": 450.00,
        "items": ["Farmhouse Pizza", "Coke Zero"],
        "category": "Food"
    }

