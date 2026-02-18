import React from 'react';
import { Settings, ExternalLink, Cpu, ShieldCheck, Terminal, Globe } from 'lucide-react';
import Header from '../components/Header';
import styles from '../stylesheets/SetupGuides.module.css';

const SetupGuides = () => {
  const guides = [
    {
      id: 1,
      title: "Development Environment",
      description: "Step-by-step instructions to set up your local machine for Cisco projects.",
      icon: <Terminal size={24} />,
    },
    {
      id: 2,
      title: "VPN & Security",
      description: "Securely connect to internal networks and set up AnyConnect/Duo.",
      icon: <ShieldCheck size={24} />,
    },
    {
      id: 3,
      title: "Access Requests",
      description: "How to request permissions for GitHub, Jira, and internal repositories.",
      icon: <Globe size={24} />,
    },
    {
      id: 4,
      title: "Hardware Setup",
      description: "Connecting your workstation, monitors, and peripheral devices.",
      icon: <Cpu size={24} />,
    }
  ];

  return (
    <div className={styles.viewport}>
      {/* 1. Standalone Header */}
      <Header />

      {/* 2. Scrollable Body */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.titleWrapper}>
              <Settings size={32} className={styles.icon} />
              <h1 className={styles.title}>Setup Guides</h1>
            </div>
            <p className={styles.subtitle}>
              Follow these technical workflows to get your workspace ready for Day 1.
            </p>
          </header>

          <div className={styles.guideGrid}>
            {guides.map((guide) => (
              <div key={guide.id} className={styles.guideCard}>
                <div style={{ color: '#2563eb', marginBottom: '1rem' }}>
                  {guide.icon}
                </div>
                <h2 className={styles.guideTitle}>{guide.title}</h2>
                <p className={styles.guideDescription}>{guide.description}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: '#2563eb', fontWeight: '500', fontSize: '0.875rem' }}>
                  Open Guide <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetupGuides;