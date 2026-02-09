import React from 'react';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
import styles from '../../stylesheets/TaskItem.module.css';

const TaskItem = ({ task, isLocked, isActive, isCompleted, onToggle }) => {
  let cardClass = styles.card;
  if (isActive) cardClass = `${styles.card} ${styles.cardActive}`;
  if (isLocked) cardClass = `${styles.card} ${styles.cardLocked}`;

  let dotClass = styles.dotRed;
  if (isCompleted) dotClass = styles.dotGreen;
  else if (isActive) dotClass = styles.dotYellow;

  let iconClass = styles.iconGray;
  if (isCompleted) iconClass = styles.iconGreen;
  else if (isActive) iconClass = styles.iconBlue;

  let titleClass = styles.title;
  if (isCompleted) titleClass = styles.titleCompleted;
  else if (isActive) titleClass = styles.titleActive;

  return (
    <div className={cardClass}>
      <div className={`${styles.statusDot} ${dotClass}`}></div>

      <div className={styles.content}>
        <div className={`${styles.iconWrapper} ${iconClass}`}>
          {task.icon}
        </div>
        <div>
          <h4 className={titleClass}>{task.title}</h4>
          <p className={styles.category}>{task.category}</p>
        </div>
      </div>
      
      <button 
        onClick={() => !isLocked && onToggle(task.id)}
        disabled={isLocked}
        className={`${styles.toggleBtn} ${isLocked ? styles.btnLocked : isCompleted ? styles.btnCompleted : styles.btnActive}`}
      >
        {isLocked ? <Lock size={20} /> : isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
    </div>
  );
};

export default TaskItem;