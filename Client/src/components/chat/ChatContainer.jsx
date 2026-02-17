import React from 'react';
import Header from './Header';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';

export default function ChatContainer() {
  const { messages, isLoading, sendMessage, messagesEndRef } = useChat();

  return (
    <>
      <Header />
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        endRef={messagesEndRef} 
      />
      <ChatInput 
        onSend={sendMessage} 
        disabled={isLoading} 
      />
    </>
  );
}