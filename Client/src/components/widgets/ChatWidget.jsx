import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { CHAT_HISTORY } from '../../data/mockData';
import styles from '../../stylesheets/ChatWidget.module.css';

const ChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(CHAT_HISTORY);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: "I can definitely help with that! Here's the documentation link you need." 
      }]);
    }, 1000);
  };

  // Determine classes
  const sidebarClass = `${styles.sidebar} ${isOpen ? styles.open : ''} ${!isOpen ? styles.closedDesktop : ''}`;

  return (
    <aside className={sidebarClass}>
      <div className={styles.header}>
        <div className="flex items-center gap-2 text-indigo-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-bold">NexBoard AI</h3>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-500"><X size={20} /></button>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map(msg => (
          <div key={msg.id} className={`${styles.msgRow} ${msg.sender === 'bot' ? styles.msgRowBot : styles.msgRowUser}`}>
            <div className={`${styles.bubble} ${msg.sender === 'bot' ? styles.bubbleBot : styles.bubbleUser}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className={styles.inputArea}>
        <form onSubmit={handleSend} className={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about setup..."
            className={styles.input}
          />
          <button type="submit" disabled={!input.trim()} className={styles.sendBtn}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </aside>
  );
};

export default ChatWidget;