import React, { useState, useEffect } from 'react';
import { BookOpen, Loader } from 'lucide-react';
import Header from '../components/Header'; // Import Header
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className={styles.viewport}>
      {/* 1. Standalone Header */}
      <Header />

      {/* 2. Scrollable Body */}
      <main className={styles.mainContent}>
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
            {courses.length === 0 ? (
              <p className="text-gray-500 italic">No courses found.</p>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.id || course._id} course={course} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequiredTrainings;