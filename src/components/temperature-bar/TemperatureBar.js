// TempComponent.jsx
import React from 'react';
import styles from '../../components/temperature-bar/TemperatureBar.module.css';

const TemperatureBar = ({ title, value }) => {
    return (
        <div className={styles.progressBarContainer}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${value}%` }}></div>
            </div>
            <div className={styles.labels}>
                <span style={{fontWeight:'lighter', fontSize:14}}>40°C</span>
            <span style={{fontWeight:'lighter', fontSize:14}}>15°C</span>
            </div>
        </div>
    );
};

export default TemperatureBar;
