import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, BookOpen } from 'lucide-react';
import styles from '../stylesheets/Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>N</div>
        <span className="text-xl font-bold tracking-tight text-gray-900">NexBoard</span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : styles.inactive}`}>
          <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
        </NavLink>
        <NavLink to="/setup" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : styles.inactive}`}>
          <Settings size={20} /> <span className="font-medium">Setup Guides</span>
        </NavLink>
        <NavLink to="/learning" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : styles.inactive}`}>
          <BookOpen size={20} /> <span className="font-medium">Learning Path</span>
        </NavLink>
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userCard}>
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">JD</div>
          <div>
            <p className="text-sm font-semibold">Alex Johnson</p>
            <p className="text-xs text-gray-500">Software Engineer I</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;