import json
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA LOADER ---
def get_db():
    try:
        with open('mock_data.json', 'r') as f:
            return json.load(f)
    except:
        return {}

db = get_db()

class ChatRequest(BaseModel):
    message: str

@app.get("/dashboard")
def get_dashboard():
    user = db['user_profile']
    
    # 1. "Will I Be Broke?" Engine 
    # Logic: (Balance / Days) * 0.8 Safety Factor
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
    msg = req.message.lower()
    user = db['user_profile']
    
    # 2. Effort-to-Cost Engine & Impulse Cooldown [cite: 27, 43]
    if "buy" in msg or "shoes" in msg or "3000" in msg:
        # Math: Price / Hourly Wage
        price = 3000
        work_hours = price / user['hourly_wage']
        return {
            "response": f"🛑 STOP!! That costs ₹{price}. That is {int(work_hours)} hours of your internship work. The 'Impulse Cooldown' is active. Wait 24 hours.",
            "type": "intervention"
        }
    
    # 3. Subscription Stalker Script 
    elif "cancel" in msg or "netflix" in msg:
        return {
            "response": "Here is a negotiation script: 'Hi Netflix, I am a student auditing my expenses. I haven't used the service in 32 days. Please waive this month's fee and cancel.'",
            "type": "script"
        }

    # 4. Roommate Arbitration 
    elif "owe" in msg or "rahul" in msg:
        return {
            "response": "I've updated the Roommate OS. I'll send a neutral reminder to Rahul for the ₹450 Electricity Bill so you don't have to be the bad guy.",
            "type": "social"
        }

    else:
        return {
            "response": "I'm listening. I'm here to help you manage your money without the judgment.",
            "type": "general"
        }

@app.post("/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    # 5. Zero-Friction Logging (OCR) 
    # Mocking the Tesseract/ML Kit response for the demo
    return {
        "merchant": "Domino's Pizza",
        "total": 450.00,
        "items": ["Farmhouse Pizza", "Coke Zero"],
        "date": "2025-12-25"
    }
