import React from 'react';
import ChatContainer from '../components/chat/ChatContainer';
import styles from '../stylesheets/chat/AskQuestion.module.css';

const AskQuestion = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Main Chat Area */}
      <div className={styles.contentWrapper}>
        <div className={styles.chatCard}>
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;