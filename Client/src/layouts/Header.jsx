import React from 'react';
import { Search, Bell, Menu, MessageSquare } from 'lucide-react';
import styles from '../stylesheets/Header.module.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h2 className={styles.pageTitle}>Overview</h2>
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className={styles.searchInput}
          />
        </div>
        
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.notifDot}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;