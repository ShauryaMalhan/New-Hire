import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Sidebar is gone
import { getUser } from '../services/userApi';
import styles from '../stylesheets/MainLayout.module.css';

const MainLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className={styles.layout}>
      {/* Pass user to Header for the profile dropdown */}
      <Header user={user} />
      
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;