import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header"; // Standalone Header
import styles from "../stylesheets/chat/ChatLayout.module.css"; 
import ReactMarkdown from "react-markdown"; 
import { Send, Plus, MessageSquare, User, Bot, FileText } from "lucide-react";

const RAG_API = "http://localhost:3000";

const ChatLayout = () => {
  const { user } = useContext(AuthContext);
  const ciscoId = user?.ciscoId || user?.username || user?.id || "guest";

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (ciscoId) loadSessions();
  }, [ciscoId]);

  const loadSessions = async () => {
    try {
      const res = await axios.get(`${RAG_API}/sessions/${ciscoId}`);
      setSessions(res.data.sessions);
    } catch (err) { console.error("Sidebar Error:", err); }
  };

  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    } else {
      setMessages([]); 
    }
  }, [currentSessionId]);

  const loadMessages = async (sessionId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${RAG_API}/session/${sessionId}`);
      const uiMsgs = res.data.history.map(m => ({
        sender: m.role === 'user' ? 'user' : 'bot',
        text: m.content,
        sources: m.sources || []
      }));
      setMessages(uiMsgs);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const question = input;
    setInput("");
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    setLoading(true);

    try {
      const res = await axios.post(`${RAG_API}/query`, {
        question,
        ciscoId,
        sessionId: currentSessionId
      });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.answer, sources: res.data.sources }]);
      if (!currentSessionId && res.data.sessionId) {
        setCurrentSessionId(res.data.sessionId);
        loadSessions(); 
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Server Error" }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  return (
    <div className={styles.viewport}>
      {/* 1. Header fixed at top */}
      <Header />

      {/* 2. Chat Layout Container */}
      <div className={styles.layoutWrapper}>
        <div className={styles.layout}>
          
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div onClick={() => setCurrentSessionId(null)} className={styles.newChatBtn}>
              <Plus size={16} /> New Chat
            </div>
            <div className={styles.sessionList}>
              {sessions.map(session => (
                <div 
                  key={session.id} 
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`${styles.sessionItem} ${currentSessionId === session.id ? styles.activeSession : ''}`}
                >
                  <MessageSquare size={14} style={{ flexShrink: 0 }} /> 
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title}</span>
                </div>
              ))}
            </div>
            <div className={styles.userProfile}>
              <User size={16} /> 
              <span style={{fontSize: '0.8rem'}}>{ciscoId}</span>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={styles.main}>
            <div className={styles.chatWindow}>
              {messages.length === 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: '15%', color: '#9ca3af' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>NexBoard AI</h2>
                  <p>How can I help you with your onboarding today?</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.userRow : styles.botRow}`}>
                  <div className={styles.avatar}>
                    {msg.sender === 'user' ? <User size={16}/> : <Bot size={16}/>}
                  </div>
                  <div className={styles.bubble}>
                    {msg.sender === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : <p style={{ margin: 0 }}>{msg.text}</p>}
                    {msg.sources && msg.sources.length > 0 && (
                       <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>
                          <strong>Sources:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                            {[...new Set(msg.sources)].map((src, idx) => (
                              <span key={idx} style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                                <FileText size={10} style={{ marginRight: '3px' }}/>
                                {src.replace(/^.*[\\\/]/, '')}
                              </span>
                            ))}
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                 <div className={`${styles.messageRow} ${styles.botRow}`}>
                   <div className={styles.avatar}><Bot size={16} /></div>
                   <div style={{ padding: '1rem', color: '#6b7280', fontStyle: 'italic' }}>Thinking...</div>
                 </div>
              )}
              <div ref={scrollRef} />
            </div>

            <div className={styles.inputContainer}>
              <form onSubmit={handleSend} className={styles.inputWrapper}>
                <input className={styles.inputField} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." disabled={loading} />
                <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}><Send size={18}/></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;