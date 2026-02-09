import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header'; // Reuse your existing header, update imports if needed
import ChatWidget from '../components/widgets/ChatWidget';
import styles from '../stylesheets/MainLayout.module.css';

const MainLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className={styles.container}>
      <Sidebar />
      
      <div className={styles.contentWrapper}>
        <Header onMenuClick={() => {}} /> {/* Pass mobile handler if needed */}
        
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className={styles.chatToggle}>
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default MainLayout;