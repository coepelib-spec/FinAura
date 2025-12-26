import { useState, useEffect } from 'react';
import { Wallet, MessageCircle, Users, Menu, X, Bell } from 'lucide-react';
import './App.css';

// USE YOUR RENDER URL HERE
const API_URL = 'https://finaura-backend.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error("Server Offline");
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Syncing FinAura...</p></div>;
  if (!data) return <div className="error-screen">⚠️ Backend is Asleep. Open Render URL to wake it up!</div>;

  return (
    <div className="app-container">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <nav className="sidebar">
        <div className="logo">FinAura ✨</div>
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
          <Wallet size={20} /> Dashboard
        </button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>
          <MessageCircle size={20} /> AI Therapist
        </button>
        <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}>
          <Users size={20} /> Social & Gigs
        </button>
      </nav>

      {/* Main Content */}
      <main className="content">
        {activeTab === 'dashboard' && <DashboardView data={data} />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'tools' && <ToolsView data={data} />}
      </main>

      {/* Mobile Bottom Navigation (Visible only on Phone) */}
      <div className="mobile-nav">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
          <Wallet size={24} />
          <span>Home</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>
          <MessageCircle size={24} />
          <span>Chat</span>
        </button>
        <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}>
          <Users size={24} />
          <span>Tools</span>
        </button>
      </div>
    </div>
  );
}

function DashboardView({ data }) {
  return (
    <div className="view-container fade-in">
      <header className="mobile-header">
        <div>
          <h1>Hello, {data.user.name} 👋</h1>
          <span className="dna-badge">{data.user.spending_dna}</span>
        </div>
        <div className="profile-icon">A</div>
      </header>

      {/* Hero Card */}
      <div className="hero-card">
        <div className="glass-effect">
          <p className="hero-label">Safe-to-Spend Today</p>
          <h1 className="hero-amount">₹{data.safe_to_spend}</h1>
          <p className="hero-sub">Daily limit to survive the month.</p>
        </div>
      </div>

      {/* Warning Banner */}
      {data.user.mood === 'Stressed' && (
        <div className="alert-banner">
          <Bell size={18} />
          <p>High Stress Detected. Impulse protection is <strong>ON</strong>.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Balance</span>
          <h3 className="stat-value">₹{data.user.current_balance}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Days Left</span>
          <h3 className="stat-value">{data.user.days_left}</h3>
        </div>
      </div>

      {/* Subscription Stalker */}
      {data.unused_sub && (
        <div className="vampire-card">
          <div className="vampire-header">
            <h3>🧛 Vampire Alert</h3>
            <span className="tag-red">Unused</span>
          </div>
          <p>You are wasting money on <strong>{data.unused_sub.name}</strong>.</p>
          <button className="btn-vampire">Stop Wasting ₹{data.unused_sub.cost}</button>
        </div>
      )}
    </div>
  );
}

function ChatView() {
    // Re-use your existing Chat Logic here, just wrap it in <div className="view-container">
    return <div className="view-container"><h2 style={{textAlign:'center', marginTop: '20px'}}>AI Therapist Loaded 🤖</h2></div>; 
}

function ToolsView({ data }) {
    // Re-use your existing Tools Logic here
     return <div className="view-container"><h2 style={{textAlign:'center', marginTop: '20px'}}>Tools Loaded 🛠️</h2></div>;
}

export default App;
