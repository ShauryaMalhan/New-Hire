import React from 'react';
import { Bot } from 'lucide-react';
import styles from '../../stylesheets/chat/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.iconWrapper}>
        <Bot size={24} color="white" />
      </div>
      <div className={styles.titleContainer}>
        <h1>NexBoard Knowledge Base</h1>
        <p className={styles.subtitle}>Internal Policy Assistant</p>
      </div>
    </header>
  );
}