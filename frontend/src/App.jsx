import { useState, useEffect } from 'react';
import { Wallet, MessageCircle, Users, Briefcase, AlertCircle } from 'lucide-react';
import './App.css';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/dashboard`).then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div className="loading">Syncing Spending DNA...</div>;

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2>FinAura ✨</h2>
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
          <Wallet size={18}/> Dashboard
        </button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>
          <MessageCircle size={18}/> Therapist
        </button>
        <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}>
          <Users size={18}/> Social & Gigs
        </button>
      </nav>

      <main className="content">
        {activeTab === 'dashboard' && <DashboardView data={data} />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'tools' && <ToolsView data={data} />}
      </main>
    </div>
  );
}

function DashboardView({ data }) {
  return (
    <div className="fade-in">
      <header>
        <h1>{data.user.name}'s Reality Check</h1>
        <span className="dna-tag">{data.user.spending_dna} Profile</span>
      </header>

      <div className="hero-card">
        [span_13](start_span)<p>Daily "Safe-to-Spend" Limit[span_13](end_span)</p>
        <h1 className="big-amt">₹{data.safe_to_spend}</h1>
        [span_14](start_span)[span_15](start_span){data.user.mood === 'Stressed' && <p className="warning">⚠️ High Stress Detected: Impulse Cooldown Active[span_14](end_span)[span_15](end_span)</p>}
      </div>

      <div className="vampire-card">
        [span_16](start_span)<h3>Subscription Stalker[span_16](end_span)</h3>
        <p>Found unused <strong>{data.unused_sub.name}</strong>. Save ₹{data.unused_sub.cost}?</p>
        <button className="btn-secondary">Generate Cancel Script</button>
      </div>
    </div>
  );
}

function ToolsView({ data }) {
  return (
    <div className="fade-in">
      <section className="tool-section">
        [span_17](start_span)<h3>Roommate OS[span_17](end_span)</h3>
        {data.roommates.map(r => (
          <div key={r.id} className="item-row">
            <span>{r.name} ({r.reason})</span>
            <span className={r.type === 'owe_you' ? 'positive' : 'negative'}>
              {r.type === 'owe_you' ? '+' : '-'}₹{r.amount}
            </span>
          </div>
        ))}
        [span_18](start_span)<button className="btn-primary">AI Arbitration: Remind All[span_18](end_span)</button>
      </section>

      <section className="tool-section">
        [span_19](start_span)<h3>Hustle Finder[span_19](end_span)</h3>
        {data.gigs.map(g => (
          <div key={g.id} className="item-row">
            <span>{g.title}</span>
            <span className="pay-tag">₹{g.pay}</span>
          </div>
        ))}
        [span_20](start_span)<p className="hint">Bridge your budget gap with local work[span_20](end_span).</p>
      </section>
    </div>
  );
}

// (Keep the previous ChatView logic here)

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
      
