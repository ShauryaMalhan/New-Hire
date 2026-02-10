import React, { useState, useEffect } from 'react';
import { BookOpen, Loader } from 'lucide-react';
import CourseCard from '../components/widgets/CourseCard';
import { getCourses } from '../services/courseApi';
import styles from '../stylesheets/RequiredTrainings.module.css';

const RequiredTrainings = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader className="animate-spin inline" /> Loading Courses...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <BookOpen size={32} className={styles.icon} />
          <h1 className={styles.title}>Required Trainings & Courses</h1>
        </div>
        <p className={styles.subtitle}>
          Complete these modules to ensure compliance and readiness.
        </p>
      </header>

      <div className={styles.grid}>
        {courses.map((course) => (
          <CourseCard key={course.id || course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RequiredTrainings;