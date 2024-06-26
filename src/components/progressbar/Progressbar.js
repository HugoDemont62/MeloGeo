import React from 'react';
import styles from '../progressbar/Progressbar.module.css';

const ProgressBar = ({ title, value }) => {
    return (
        <div className={styles.progressBarContainer}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${value}%` }}></div>
            </div>
            <div className={styles.labels}>
                <span>Très faible</span>
                <span>Très fort</span>
            </div>
        </div>
    );
};

export default ProgressBar;
