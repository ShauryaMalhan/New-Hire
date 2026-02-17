import React from 'react';
import { Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import styles from '../../stylesheets/chat/MessageList.module.css';

export default function MessageList({ messages, isLoading, endRef }) {
  return (
    <div className={styles.listContainer}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingBubble}>
            <Loader2 className={styles.spinner} size={16} />
            <span>Reading documents...</span>
          </div>
        </div>
      )}
      
      <div ref={endRef} />
    </div>
  );
}