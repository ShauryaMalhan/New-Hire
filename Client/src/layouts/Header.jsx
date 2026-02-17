import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
// 1. Import MessageSquare icon for the chat page
import { LayoutDashboard, BookOpen, Settings, User, LogOut, ChevronDown, Hexagon, MessageSquare } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import styles from '../stylesheets/Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fullName = user ? user.fullName : 'Loading...';
  const role = user ? user.role : '';
  const initials = user?.fullName 
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'NB';

  return (
    <header className={styles.header}>
      
      {/* 1. Logo */}
      <Link to="/" className={styles.logoContainer}>
        <Hexagon className={styles.logoIcon} size={28} strokeWidth={2.5} />
        <span className={styles.logoText}>NexBoard</span>
      </Link>

      {/* 2. Navigation */}
      <nav className={styles.nav}>
        <NavLink to="/" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/learning" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <BookOpen size={18} />
          <span>Required Trainings</span>
        </NavLink>

        {/* --- NEW LINK: Ask AI --- */}
        <NavLink to="/ask" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <MessageSquare size={18} />
          <span>Ask AI</span>
        </NavLink>

        <NavLink to="/setup" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          <Settings size={18} />
          <span>Setup Guides</span>
        </NavLink>
      </nav>

      {/* 3. User Profile & Dropdown */}
      <div className={styles.userContainer} ref={dropdownRef}>
        <div className={styles.userProfile} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{fullName}</span>
            <span className={styles.userRole}>{role}</span>
          </div>
          <div className={styles.avatar}>{initials}</div>
          <ChevronDown size={16} className={styles.chevron} />
        </div>

        <div className={`${styles.dropdown} ${isOpen ? styles.show : ''}`}>
          <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            <User size={16} /> 
            <span>View Profile</span>
          </Link>
          
          <div className={styles.separator}></div>
          
          <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
            <LogOut size={16} /> 
            <span>Sign out</span>
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;