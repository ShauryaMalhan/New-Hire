import React, { useState, useEffect } from 'react';
import { Mail, Phone, Hash, Briefcase, Users } from 'lucide-react';
// UPDATE: Importing from specific API file
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

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!user) return <div className="p-10 text-center">User not found.</div>;

  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatarCircle}>{initials}</div>
          <h1 className={styles.name}>{user.fullName}</h1>
          <p className={styles.role}>{user.role}</p>
        </div>

        {/* Details Grid */}
        <div className={styles.body}>
          <div>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            
            <div className={styles.infoGroup}>
              <span className={styles.label}><Mail size={16} className="inline mr-1"/> Email</span>
              <div className={styles.value}>{user.email}</div>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.label}><Phone size={16} className="inline mr-1"/> Mobile</span>
              <div className={styles.value}>{user.mobile}</div>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.label}><Hash size={16} className="inline mr-1"/> Cisco ID</span>
              <div className={styles.value}>{user.ciscoId}</div>
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Department Details</h3>

            <div className={styles.infoGroup}>
              <span className={styles.label}><Users size={16} className="inline mr-1"/> Team</span>
              <div className={styles.value}>{user.team}</div>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.label}><Briefcase size={16} className="inline mr-1"/> Manager</span>
              <div className={styles.value}>{user.manager}</div>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.label}><Hash size={16} className="inline mr-1"/> Department #</span>
              <div className={styles.value}>{user.departmentNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;