import React, { useState, useEffect } from 'react';
import { Settings, ArrowDown, Loader } from 'lucide-react';
import Header from '../components/Header';
import { getTasks, updateTaskStatus } from '../services/taskApi';
import { getUser } from '../services/userApi';
import styles from '../stylesheets/Dashboard.module.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, tasksData] = await Promise.all([
          getUser(),
          getTasks()
        ]);
        
        setUser(userData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error connecting to backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleTask = async (id) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    if (taskIndex > 0 && tasks[taskIndex - 1].status !== 'completed') return;

    const newStatus = tasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
    
    const newTasks = [...tasks];
    newTasks[taskIndex] = { ...newTasks[taskIndex], status: newStatus };
    setTasks(newTasks);

    try {
      await updateTaskStatus(id, newStatus);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const firstName = user ? user.fullName.split(' ')[0] : 'New Hire';

  return (
    <div className={styles.viewport}>
      {/* 1. Header stays fixed at top */}
      <Header />

      {/* 2. Scrollable Dashboard Area */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome aboard, {firstName}! 🚀</h1>
              <p className="text-blue-100 mb-6 max-w-xl">
                {user?.role ? `You are joining as a ${user.role}.` : ''} 
                Day 1 can be overwhelming, but we've organized everything you need right here.
              </p>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-md border border-white/20">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-medium text-white">Onboarding Progress</span>
                  <span className="font-bold">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Workflow Section */}
          <div className={styles.workflowSection}>
            <h3 className={styles.sectionTitle}>
              <Settings className="text-blue-600" size={24} /> Priority Setup Workflow
            </h3>
            
            {tasks.length === 0 ? (
              <p className="text-gray-500 italic">No tasks assigned yet.</p>
            ) : (
              <div className={styles.workflowContainer}>
                <div className={styles.workflowLine}></div>
                <div className="space-y-1 relative z-10">
                  {tasks.map((task, index) => {
                    const isCompleted = task.status === 'completed';
                    const isLocked = index > 0 && tasks[index - 1].status !== 'completed';
                    const isActive = !isCompleted && !isLocked;

                    return (
                      <React.Fragment key={task.id}>
                        <TaskItem 
                          task={task} 
                          isLocked={isLocked}
                          isActive={isActive}
                          isCompleted={isCompleted}
                          onToggle={toggleTask} 
                        />
                        {index < tasks.length - 1 && (
                          <div className={styles.arrowContainer}>
                            <ArrowDown size={16} className={`${styles.arrowIcon} ${isActive ? 'text-blue-500 animate-bounce' : ''}`} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;