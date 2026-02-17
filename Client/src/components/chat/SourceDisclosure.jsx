import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import styles from '../../stylesheets/chat/SourceDisclosure.module.css';

export default function SourceDisclosure({ sources }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.disclosureWrapper}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isOpen ? 'Hide Sources' : `View ${sources.length} Sources`}
      </button>

      {isOpen && (
        <div className={styles.sourceList}>
          {sources.map((src, idx) => {
            const match = typeof src === 'string' ? src.match(/\[Source: (.*?)\]\n([\s\S]*)/) : null;
            const title = match ? match[1] : "Unknown Source";
            const content = match ? match[2] : (typeof src === 'string' ? src : JSON.stringify(src));

            return (
              <div key={idx} className={styles.sourceCard}>
                <div className={styles.sourceHeader}>
                  <FileText size={12} />
                  <span>{title}</span>
                </div>
                <p className={styles.sourceText}>
                  {content.substring(0, 150)}...
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}