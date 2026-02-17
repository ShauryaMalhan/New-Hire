import { useState, useRef, useEffect } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Hello! I am your NexBoard AI assistant. Ask me anything about our onboarding policies or hiring paths.', 
      sources: [] 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // 1. Add User Message immediately
    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call your RAG Backend (Ensure your RAG server is running on port 3000)
      const response = await fetch('http://localhost:3000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      // 3. Add Bot Message
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.answer,
        sources: data.context || [] 
      };
      setMessages((prev) => [...prev, botMsg]);
      
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev, 
        { id: Date.now(), type: 'bot', text: '⚠️ Connection error. Please ensure the RAG server is running.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    messages, 
    isLoading, 
    sendMessage, 
    messagesEndRef 
  };
}