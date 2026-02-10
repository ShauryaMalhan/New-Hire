import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import styles from '../stylesheets/Header.module.css';

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = user ? user.fullName : 'Loading...';
  const role = user ? user.role : '';
  const initials = user ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '...';

  return (
    <header className={styles.header}>
      
      {/* 1. Logo (Left) */}
      <Link to="/" className={styles.logoContainer}>
        <div className={styles.logoIcon}>N</div>
        <span>NexBoard</span>
      </Link>

      {/* 2. Navigation (Center) */}
      <nav className={styles.nav}>
        <NavLink to="/" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/learning" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <BookOpen size={18} />
          Required Trainings
        </NavLink>

        <NavLink to="/setup" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <Settings size={18} />
          Setup Guides
        </NavLink>
      </nav>

      {/* 3. User Profile (Right) */}
      <div className={styles.userContainer} ref={dropdownRef}>
        <div className={styles.userProfile} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{fullName}</span>
            <span className={styles.userRole}>{role}</span>
          </div>
          <div className={styles.avatar}>{initials}</div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>

        <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
          <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            <User size={16} /> View Profile
          </Link>
          <div className="h-px bg-gray-100"></div>
          <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={() => console.log('Logout')}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;