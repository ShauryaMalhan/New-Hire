import React from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SourceDisclosure from './SourceDisclosure';
import styles from '../../stylesheets/chat/MessageBubble.module.css';

export default function MessageBubble({ message }) {
  const isUser = message.type === 'user';

  return (
    <div className={`${styles.container} ${isUser ? styles.user : styles.bot}`}>
      <div className={styles.wrapper}>
        
        {/* Avatar */}
        <div className={`${styles.avatar} ${isUser ? styles.user : styles.bot}`}>
          {isUser ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
        </div>

        {/* Content Column */}
        <div className={styles.contentCol}>
          <div className={`${styles.bubble} ${isUser ? styles.user : styles.bot}`}>
            {isUser ? (
              message.text
            ) : (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            )}
          </div>

          {!isUser && message.sources?.length > 0 && (
            <SourceDisclosure sources={message.sources} />
          )}
        </div>
      </div>
    </div>
  );
}