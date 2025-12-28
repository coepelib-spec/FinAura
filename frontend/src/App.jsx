import { useState, useEffect } from 'react';
import { Wallet, MessageCircle, Users, Camera, Bell, ArrowRight, X, Play, TrendingUp } from 'lucide-react';
import './App.css';

// ⚠️ YOUR RENDER BACKEND URL
const API_URL = 'https://finaura-backend.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStory, setShowStory] = useState(false); // For Gamification Mode

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Syncing FinAura...</p></div>;
  if (!data) return <div className="error-screen">⚠️ Backend Sleeping. Refresh!</div>;

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <nav className="sidebar">
        <div className="logo">FinAura ✨</div>
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}><Wallet size={20}/> Dashboard</button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}><MessageCircle size={20}/> AI Therapist</button>
        <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}><Users size={20}/> Social & Gigs</button>
      </nav>

      {/* Main Content Area */}
      <main className="content">
        {activeTab === 'dashboard' && <DashboardView data={data} onOpenStory={() => setShowStory(true)} />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'tools' && <ToolsView data={data} />}
      </main>

      {/* Mobile Navigation (Bottom Bar) */}
      <div className="mobile-nav">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}><Wallet size={24}/><span>Home</span></button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}><MessageCircle size={24}/><span>Chat</span></button>
        <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}><Users size={24}/><span>Tools</span></button>
      </div>

      {/* GAMIFICATION: "Spotify Wrapped" Story Mode Overlay */}
      {showStory && (
        <div className="story-overlay fade-in" onClick={() => setShowStory(false)}>
          <div className="story-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowStory(false)}><X size={24} /></button>
            <div className="story-content">
              <h2>Your Money Vibe 🎵</h2>
              <div className="story-stat">
                <span>Spending DNA</span>
                <h1>{data.user.spending_dna}</h1>
              </div>
              <div className="story-stat">
                <span>Top Category</span>
                <h1>🍔 Food & Drinks</h1>
              </div>
              <div className="story-stat">
                <span>Rank on Campus</span>
                <h1>Top 15% 🏆</h1>
              </div>
              <p className="story-footer">"You're saving better than 85% of students!"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- DASHBOARD VIEW ---
function DashboardView({ data, onOpenStory }) {
  return (
    <div className="view-container fade-in">
      <header className="mobile-header">
        <div>
          <h1>Hello, {data.user.name} 👋</h1>
          <span className="dna-badge">{data.user.spending_dna} Profile</span>
        </div>
        {/* Gamification Trigger */}
        <button className="icon-btn" style={{background: '#e0e7ff', color: '#6366f1'}} onClick={onOpenStory}>
          <Play size={20} fill="currentColor" />
        </button>
      </header>
      
      {/* 1. Will I Be Broke Engine (Clean Text - No Spans!) */}
      <div className="hero-card">
        <div className="glass-effect">
          <p className="hero-label">Safe-to-Spend Today</p>
          <h1 className="hero-amount">₹{data.safe_to_spend}</h1>
          <p className="hero-sub">Daily limit to survive the month.</p>
        </div>
      </div>

      {/* 2. Anonymous Benchmarking (PPT Requirement) */}
      <div className="card-simple">
        <div className="card-header-row">
            <h3><TrendingUp size={16}/> Peer Comparison</h3>
            <span className="tag-gray">Anonymous</span>
        </div>
        
        <div className="benchmark-row">
            <div className="benchmark-labels">
                <span>Your Savings</span>
                <span className="txt-green">Top 10%</span>
            </div>
            <div className="progress-bg"><div className="progress-fill green" style={{width: '90%'}}></div></div>
        </div>

        <div className="benchmark-row">
            <div className="benchmark-labels">
                <span>Impulse Buys</span>
                <span className="txt-red">High</span>
            </div>
            <div className="progress-bg"><div className="progress-fill red" style={{width: '75%'}}></div></div>
        </div>
      </div>

      {/* 3. Impulse Control Warning */}
      {data.user.mood === 'Stressed' && (
        <div className="alert-banner">
            <Bell size={18} />
            <p>High Stress Detected. Impulse protection <strong>ON</strong>.</p>
        </div>
      )}

      {/* 4. Subscription Stalker */}
      {data.unused_sub && (
        <div className="vampire-card">
          <div className="vampire-header">
            <h3>🧛 Vampire Alert</h3>
            <span className="tag-red">Unused</span>
          </div>
          <p>You are wasting money on <strong>{data.unused_sub.name}</strong>.</p>
          <button className="btn-vampire" onClick={() => alert("Cancellation Script Generated!")}>
            Save ₹{data.unused_sub.cost}
          </button>
        </div>
      )}
    </div>
  );
}

// --- CHAT THERAPIST VIEW ---
function ChatView() {
  const [messages, setMessages] = useState([{ text: "I noticed you viewed a ₹3000 shoe ad. Want to talk about it?", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;
    const newMsgs = [...messages, { text: input, sender: 'user' }];
    setMessages(newMsgs);
    setInput('');
    
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages([...newMsgs, { text: data.response, sender: 'bot' }]);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="view-container fade-in full-height">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>{m.text}</div>
        ))}
      </div>
      <div className="input-area">
        <button className="icon-btn" onClick={() => alert("Scanning Receipt... (Mock OCR)")}>
            <Camera size={20} />
        </button>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type here..." />
        <button className="send-btn" onClick={sendMessage}><ArrowRight size={18}/></button>
      </div>
    </div>
  );
}

// --- TOOLS VIEW (Roommate OS + Hustle) ---
function ToolsView({ data }) {
  return (
    <div className="view-container fade-in">
      {/* Roommate OS */}
      <section className="tool-section">
        <h3>🏠 Roommate OS</h3>
        {data.roommates.map(r => (
          <div key={r.id} className="list-item">
            <div className="item-left">
                <div className="avatar">{r.name[0]}</div>
                <div><p className="item-title">{r.name}</p><p className="item-sub">{r.reason}</p></div>
            </div>
            <div className="item-right">
                <span className={r.type === 'owe_you' ? 'txt-green' : 'txt-red'}>
                    {r.type === 'owe_you' ? '+' : '-'}₹{r.amount}
                </span>
                {r.type === 'owe_you' && <button className="btn-xs" onClick={() => alert(`Neutral Reminder sent to ${r.name}!`)}>Nudge</button>}
            </div>
          </div>
        ))}
      </section>

      {/* Hustle Finder */}
      <section className="tool-section">
        <h3>💼 Hustle Finder</h3>
        {data.gigs.map(g => (
          <div key={g.id} className="list-item">
            <div className="item-left">
                <div className="icon-box">⚡</div>
                <div><p className="item-title">{g.title}</p><p className="item-sub">{g.location} • {g.time}</p></div>
            </div>
            <button className="btn-outline">Earn ₹{g.pay}</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
      
