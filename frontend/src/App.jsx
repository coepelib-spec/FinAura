import { useState, useEffect } from 'react';
import { Wallet, MessageCircle, Users, Camera, Bell, ArrowRight, CheckCircle } from 'lucide-react';
import './App.css';

// ⚠️ CHANGE THIS TO YOUR RENDER URL
const API_URL = 'https://finaura.onrender.com'; 

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading FinAura...</p></div>;
  if (!data) return <div className="error-screen">⚠️ Connect to Backend!</div>;

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <nav className="sidebar">
        <div className="logo">FinAura ✨</div>
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}><Wallet size={20}/> Dashboard</button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}><MessageCircle size={20}/> AI Therapist</button>
        <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}><Users size={20}/> Social & Gigs</button>
      </nav>

      <main className="content">
        {activeTab === 'dashboard' && <DashboardView data={data} />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'tools' && <ToolsView data={data} />}
      </main>

      {/* Mobile Nav */}
      <div className="mobile-nav">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}><Wallet size={24}/><span>Home</span></button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}><MessageCircle size={24}/><span>Chat</span></button>
        <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}><Users size={24}/><span>Tools</span></button>
      </div>
    </div>
  );
}

// --- DASHBOARD ---
function DashboardView({ data }) {
  return (
    <div className="view-container fade-in">
      <header className="mobile-header">
        <div><h1>Hello, {data.user.name} 👋</h1><span className="dna-badge">{data.user.spending_dna}</span></div>
      </header>
      
      {/* Will I Be Broke Engine  */}
      <div className="hero-card">
        <div className="glass-effect">
          <p className="hero-label">Safe-to-Spend Today</p>
          <h1 className="hero-amount">₹{data.safe_to_spend}</h1>
          <p className="hero-sub">Daily limit to survive the month.</p>
        </div>
      </div>

      {data.user.mood === 'Stressed' && (
        <div className="alert-banner"><Bell size={18} /><p>High Stress Detected. Impulse protection <strong>ON</strong>.</p></div>
      )}

      {/* Subscription Stalker  */}
      {data.unused_sub && (
        <div className="vampire-card">
          <div className="vampire-header"><h3>🧛 Vampire Alert</h3><span className="tag-red">Unused</span></div>
          <p>Wasting money on <strong>{data.unused_sub.name}</strong>.</p>
          <button className="btn-vampire" onClick={() => alert("Script Generated!")}>Save ₹{data.unused_sub.cost}</button>
        </div>
      )}
    </div>
  );
}

// --- CHAT THERAPIST ---
function ChatView() {
  const [messages, setMessages] = useState([{ text: "I noticed you viewed a ₹3000 shoe ad. Want to talk about it?", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;
    const newMsgs = [...messages, { text: input, sender: 'user' }];
    setMessages(newMsgs);
    setInput('');
    
    // Simulate API Call
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

  const handleFileUpload = async (e) => {
    alert("Scanning Receipt... (Mock OCR)");
    // In a real app, you would append FormData here
    setTimeout(() => {
        setMessages(prev => [...prev, { text: "🧾 Scan Complete: Domino's Pizza (₹450). Added to ledger.", sender: 'bot' }]);
    }, 1500);
  };

  return (
    <div className="view-container fade-in full-height">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>{m.text}</div>
        ))}
      </div>
      <div className="input-area">
        <label className="icon-btn">
            <Camera size={20} />
            <input type="file" style={{display:'none'}} onChange={handleFileUpload}/>
        </label>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type here..." />
        <button className="send-btn" onClick={sendMessage}><ArrowRight size={18}/></button>
      </div>
    </div>
  );
}

// --- TOOLS (ROOMMATE OS + HUSTLE FINDER) ---
function ToolsView({ data }) {
  return (
    <div className="view-container fade-in">
      {/* Roommate OS [cite: 29] */}
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

      {/* Hustle Finder [cite: 31] */}
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
