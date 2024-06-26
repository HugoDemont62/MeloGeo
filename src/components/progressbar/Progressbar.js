import React from 'react';
import styles from './Progressbar.module.css';

const ProgressBar = ({ title, value }) => {
    return (
        <div className={styles.progressBarContainer}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${value}%` }}></div>
            </div>
            <div className={styles.labels}>
                <span style={{fontWeight:'lighter', fontSize:14}}>Très faible</span>
                <span style={{fontWeight:'lighter', fontSize:14}}>Très fort</span>
            </div>
        </div>
    );
};

export default ProgressBar;
