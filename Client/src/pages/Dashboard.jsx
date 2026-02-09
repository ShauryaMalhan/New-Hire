import React, { useState } from 'react';
import { Settings, ArrowDown } from 'lucide-react';
import TaskItem from '../components/widgets/TaskItem';
import { INITIAL_TASKS } from '../data/mockData'; // Removed COURSES
import styles from '../stylesheets/Dashboard.module.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    if (taskIndex > 0 && tasks[taskIndex - 1].status !== 'completed') return;

    const newStatus = tasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
    let newTasks = [...tasks];
    newTasks[taskIndex] = { ...newTasks[taskIndex], status: newStatus };

    if (newStatus === 'pending') {
      for (let i = taskIndex + 1; i < newTasks.length; i++) {
        newTasks[i] = { ...newTasks[i], status: 'pending' };
      }
    }
    setTasks(newTasks);
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome aboard, Alex! 🚀</h1>
          <p className="text-blue-100 mb-6 max-w-xl">
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

      {/* Workflow Section (Now Full Width) */}
      <div className={styles.workflowSection}>
        <h3 className={styles.sectionTitle}>
          <Settings className="text-blue-600" size={24} /> Priority Setup Workflow
        </h3>
        
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
      </div>
    </div>
  );
};

export default Dashboard;