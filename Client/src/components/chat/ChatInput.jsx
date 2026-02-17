import React, { useState } from 'react';
import { Send } from 'lucide-react';
import styles from '../../stylesheets/chat/ChatInput.module.css';

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className={styles.inputContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about our policies..."
          className={styles.inputField}
          disabled={disabled}
        />
        <button 
          type="submit" 
          disabled={disabled || !input.trim()}
          className={styles.sendButton}
        >
          <Send size={18} />
        </button>
      </form>
      <p className={styles.disclaimer}>
        AI can make mistakes. Please verify important info.
      </p>
    </div>
  );
}