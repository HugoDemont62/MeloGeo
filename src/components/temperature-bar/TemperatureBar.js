import React from 'react';
import styles from '../../components/temperature-bar/TemperatureBar.module.css';

const TemperatureBar = ({ title, value }) => {
    // Convert the value from degrees to percentage
    const minTemp = 15;
    const maxTemp = 40;
    const percentageValue = ((value - minTemp) / (maxTemp - minTemp)) * 100;

    return (
        <div className={styles.progressBarContainer}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '100%' }}></div>
                <div className={styles.marker} style={{ left: `${percentageValue}%` }}>
                    <span className={styles.markerValue}>{value}°C</span>
                </div>
            </div>
            <div className={styles.labels}>
                <span style={{ fontWeight: 'lighter', fontSize: 14 }}>15°C</span>
                <span style={{ fontWeight: 'lighter', fontSize: 14 }}>40°C</span>
            </div>
        </div>
    );
};

export default TemperatureBar;
