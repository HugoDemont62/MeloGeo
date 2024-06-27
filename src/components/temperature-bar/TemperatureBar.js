'use client'
import React, { useEffect, useState } from 'react';
import styles from '../../components/temperature-bar/TemperatureBar.module.css';

const TemperatureBar = ({ title, value, markers, heatPointId }) => {
    const [totalTempreduced, setTotalTempreduced] = useState(0);
    const [temperature, setTemperature] = useState(value);

    useEffect(() => {
        if (markers) {
            let filteredMarkers = markers.filter(marker => marker.heatPointId === heatPointId);
            let sumTempreduced = filteredMarkers.reduce((accumulator, marker) => {
                return accumulator + parseFloat(marker.tempreduced);
            }, 0);
            setTotalTempreduced(sumTempreduced);
        }
    }, [markers, heatPointId]);

    useEffect(() => {
        setTemperature(value - totalTempreduced);
    }, [totalTempreduced, value]);

    const minTemp = 15;
    const maxTemp = 40;
    let percentageValue = ((temperature - minTemp) / (maxTemp - minTemp)) * 100;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <div className={styles.temperatureBarContainer}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.temperatureBar}>
                    <div className={styles.progress} style={{ width: '100%' }}></div>
                    <div className={styles.marker} style={{ left: `${percentageValue}%` }}></div>
                </div>
                <div className={styles.labels}>
                    <span style={{ fontWeight: 'lighter', fontSize: 14 }}>15°C</span>
                    <span style={{ fontWeight: 'lighter', fontSize: 14 }}>40°C</span>
                </div>
            </div>
            <div>
                <div>
                    <p style={{ fontSize: '2rem' }}>
                        <strong>{temperature}°C</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TemperatureBar;
