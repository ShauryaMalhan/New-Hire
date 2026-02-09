import React from 'react';
import styles from '../../stylesheets/ProgressBar.module.css';

const ProgressBar = ({ percentage }) => (
  <div className={styles.container}>
    <div className={styles.fill} style={{ width: `${percentage}%` }}></div>
  </div>
);

export default ProgressBar;