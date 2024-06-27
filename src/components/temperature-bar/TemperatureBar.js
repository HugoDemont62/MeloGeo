import React from 'react';
import styles from '../../components/temperature-bar/TemperatureBar.module.css';
import { fontSize } from '@mui/system';

const TemperatureBar = ({ title, value }) => {
    // Convert the value from degrees to percentage
    const minTemp = 15;
    const maxTemp = 40;
    const percentageValue = ((value - minTemp) / (maxTemp - minTemp)) * 100;

    return (
        <div style={{display: 'flex', alignItems: 'center', gap:26}}>
            <div className={styles.temperatureBarContainer}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.temperatureBar}>
                    <div className={styles.progress} style={{ width: '100%' }}></div>
                    <div className={styles.marker} style={{ left: `${percentageValue}%` }}>
                        
                    </div>
                </div>
                <div className={styles.labels}>
                    <span style={{ fontWeight: 'lighter', fontSize: 14 }}>15°C</span>
                    <span style={{ fontWeight: 'lighter', fontSize: 14 }}>40°C</span>
                </div>
            </div>
            <div>
                <div>
                    <p style={{fontSize: '2rem'}}><strong>{value}°C</strong></p>
                </div>
            </div>
        </div>

    );
};

export default TemperatureBar;
