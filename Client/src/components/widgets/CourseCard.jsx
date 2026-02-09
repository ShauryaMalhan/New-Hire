import React from 'react';
import { Award } from 'lucide-react';
import ProgressBar from './ProgressBar';
import styles from '../../stylesheets/CourseCard.module.css';

const CourseCard = ({ course }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <span className={`${styles.badge} ${course.color}`}>
        {course.required ? 'Required' : 'Optional'}
      </span>
      {course.progress === 100 && <Award className="text-yellow-500" size={20} />}
    </div>
    <h3 className={styles.title}>{course.title}</h3>
    <p className={styles.subtitle}>{course.subtitle}</p>
    
    <div className={styles.meta}>
      <span>{course.progress}% Complete</span>
      <span>{course.totalModules} Modules</span>
    </div>
    <ProgressBar percentage={course.progress} />
  </div>
);

export default CourseCard;