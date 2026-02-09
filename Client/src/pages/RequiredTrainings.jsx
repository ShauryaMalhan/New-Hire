import React from 'react';
import { BookOpen } from 'lucide-react';
import CourseCard from '../components/widgets/CourseCard';
import { COURSES } from '../data/mockData';
import styles from '../stylesheets/RequiredTrainings.module.css';

const RequiredTrainings = () => {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <BookOpen size={32} className={styles.icon} />
          <h1 className={styles.title}>Required Trainings & Courses</h1>
        </div>
        <p className={styles.subtitle}>
          Complete these modules to ensure compliance and readiness for your role.
        </p>
      </header>

      {/* Courses Grid */}
      <div className={styles.grid}>
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RequiredTrainings;