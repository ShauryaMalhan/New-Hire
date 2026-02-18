import React, { useState, useEffect } from 'react';
import { Mail, Phone, Hash, Briefcase, Users, Loader } from 'lucide-react';
import Header from '../components/Header'; // Added Header
import { getUser } from '../services/userApi';
import styles from '../stylesheets/UserProfile.module.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) return <div className="p-10 text-center">User not found.</div>;

  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  return (
    <div className={styles.viewport}>
      {/* 1. Standalone Header */}
      <Header />

      {/* 2. Scrollable Content Body */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.card}>
            {/* Header Section */}
            <div className={styles.header}>
              <div className={styles.avatarCircle}>{initials}</div>
              <h1 className={styles.name}>{user.fullName}</h1>
              <p className={styles.role}>{user.role}</p>
            </div>

            {/* Profile Information Grid */}
            <div className={styles.body}>
              {/* Left Column: Contact */}
              <div>
                <h3 className={styles.sectionTitle}>Contact Information</h3>
                
                <div className={styles.infoGroup}>
                  <span className={styles.label}><Mail size={14} className="mr-2"/> Email</span>
                  <div className={styles.value}>{user.email}</div>
                </div>

                <div className={styles.infoGroup}>
                  <span className={styles.label}><Phone size={14} className="mr-2"/> Mobile</span>
                  <div className={styles.value}>{user.mobile}</div>
                </div>

                <div className={styles.infoGroup}>
                  <span className={styles.label}><Hash size={14} className="mr-2"/> Cisco ID</span>
                  <div className={styles.value}>{user.ciscoId}</div>
                </div>
              </div>

              {/* Right Column: Work */}
              <div>
                <h3 className={styles.sectionTitle}>Department Details</h3>

                <div className={styles.infoGroup}>
                  <span className={styles.label}><Users size={14} className="mr-2"/> Team</span>
                  <div className={styles.value}>{user.team}</div>
                </div>

                <div className={styles.infoGroup}>
                  <span className={styles.label}><Briefcase size={14} className="mr-2"/> Manager</span>
                  <div className={styles.value}>{user.manager}</div>
                </div>

                <div className={styles.infoGroup}>
                  <span className={styles.label}><Hash size={14} className="mr-2"/> Department #</span>
                  <div className={styles.value}>{user.departmentNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;