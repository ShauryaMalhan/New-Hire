import { useState } from "react";
import axios from "axios";

export const useChat = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I am NexBoard. Ask me anything about our internal documents.", 
      sender: "bot" 
    }
  ]);
  const [loading, setLoading] = useState(false);

  // POINT THIS TO YOUR LOCAL RAG SERVER
  const RAG_API_URL = "http://localhost:3000/query";

  const askQuestion = async (question) => {
    if (!question.trim()) return;

    // 1. Add User Message immediately
    const newUserMsg = { text: question, sender: "user" };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // 2. Send to Backend
      const response = await axios.post(RAG_API_URL, {
        question: question
      });

      const { answer, sources } = response.data;

      // 3. Add Bot Response
      const botResponse = {
        text: answer,
        sender: "bot",
        sources: sources || []
      };

      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error("RAG Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Error: Could not reach NexBoard Knowledge Base.", sender: "bot" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, askQuestion };
};