from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load context-aware data
with open('mock_data.json') as f:
    db = json.load(f)

class ChatRequest(BaseModel):
    message: str

@app.get("/dashboard")
def get_dashboard():
    user = db['user_profile']
    # "Will I Be Broke?" [span_7](start_span)Engine logic[span_7](end_span)
    safe_limit = (user['current_balance'] / user['days_left']) * 0.8
    return {
        "user": user,
        "safe_to_spend": int(safe_limit),
        "gigs": db['gig_opportunities'],
        "roommates": db['roommate_ledger'],
        "unused_sub": db['subscriptions'][0]
    }

@app.post("/chat")
def financial_therapist(req: ChatRequest):
    msg = req.message.lower()
    user = db['user_profile']
    
    # 1. [span_8](start_span)Effort-to-Cost Engine[span_8](end_span)
    if "buy" in msg and "3000" in msg:
        work_hours = 3000 / user['hourly_wage']
        return {
            [span_9](start_span)"response": f"🛑 STOP!! That purchase costs {int(work_hours)} hours of work. Since you're feeling '{user['mood']}', this might be stress-spending[span_9](end_span). Wait 24 hours?",
            "type": "intervention"
        }
    
    # 2. [span_10](start_span)Subscription Stalker (AI Script Generator)[span_10](end_span)
    if "cancel" in msg or "netflix" in msg:
        return {
            "response": "Generated Script: 'Hi Netflix Support, I am a student auditing my expenses. I haven't used the service in 30 days. Please waive this month's fee and cancel.' Want me to send this?",
            "type": "script"
        }

    return {"response": "I'm here to help. How are you feeling about your budget today?"}
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
  
