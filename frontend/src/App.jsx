import { useState, useEffect } from 'react';
import { LayoutDashboard, MessageCircle, Wallet, AlertTriangle, Send, ScanLine } from 'lucide-react';
import './App.css';

// Ensure this matches your running Backend URL
const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="logo">
          <h2>FinAura ✨</h2>
        </div>
        <div className="nav-links">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            className={activeTab === 'chat' ? 'active' : ''} 
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle size={20} /> AI Therapist
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' ? <Dashboard /> : <ChatInterface />}
      </main>
    </div>
  );
}

// --- COMPONENT: DASHBOARD ---
function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Backend offline:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Connecting to FinAura Brain...</div>;
  if (!data) return <div className="error">⚠️ Backend Offline. Run: uvicorn main:app --reload</div>;

  return (
    <div className="dashboard-view fade-in">
      <header className="header">
        <h1>Welcome back, {data.user_name} 👋</h1>
        <span className="badge">{data.spending_dna}</span>
      </header>

      {/* The "Will I Be Broke?" Engine */}
      <div className="hero-card">
        <div className="hero-content">
          <span className="label">Safe-to-Spend Daily Limit</span>
          <h1 className="big-number">₹{data.safe_to_spend_daily}</h1>
          <p>You have {data.days_left} days left. Spend less than this to survive.</p>
        </div>
        <div className="hero-icon">
          <Wallet size={64} opacity={0.2} />
        </div>
      </div>

      <div className="grid-container">
        {/* Balance Card */}
        <div className="card">
          <h3>Total Balance</h3>
          <p className="value">₹{data.balance}</p>
        </div>

        {/* Vampire Subscription Alert */}
        {data.vampire_subscriptions.length > 0 && (
          <div className="card vampire-alert">
            <div className="card-header">
              <AlertTriangle color="#e11d48" />
              <h3>Vampire Alert</h3>
            </div>
            <p>You are paying <strong>₹{data.vampire_subscriptions[0].cost}</strong> for {data.vampire_subscriptions[0].name} but not using it!</p>
            <button className="btn-action" onClick={() => alert("AI is negotiating cancellation...")}>
              Cancel Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENT: CHAT INTERFACE ---
function ChatInterface() {
  const [messages, setMessages] = useState([
    { text: "Hi Aryan, I'm your Financial Therapist. I noticed you're eyeing some expensive shoes. Want to talk about it?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      
      // Simulate slight delay for realism
      setTimeout(() => {
        setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
        setIsTyping(false);
      }, 500);

    } catch (error) {
      setMessages(prev => [...prev, { text: "⚠️ Error: AI Brain is offline.", sender: 'bot' }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-view fade-in">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="message bot typing">Typing...</div>}
      </div>

      <div className="input-area">
        <button className="icon-btn" onClick={() => alert("Opening Camera for Receipt Scan...")}>
          <ScanLine size={20} />
        </button>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default App;
      
