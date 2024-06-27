import React from 'react';
import styles from '../../components/temperature-bar/TemperatureBar.module.css';
import { fontSize } from '@mui/system';
import { Vazirmatn } from 'next/font/google';

const TemperatureBar = ({ title, value, markers, heatPointId }) => {
    // Regrouper les données par heatPointId
    const groupedData = markers.reduce((acc, item) => {
        const { heatPointId: id } = item;
        if (!acc[id]) {
            acc[id] = [];
        }
        acc[id].push(item);
        return acc;
    }, {});

    console.log(groupedData);

    // Calculer le total de tempreduced pour chaque heatPointId
    const totals = Object.keys(groupedData).reduce((acc, id) => {
        const totalTempreduced = groupedData[id].reduce((sum, item) => {
            return sum + parseFloat(item.tempreduced);
        }, 0);
        acc[id] = totalTempreduced;
        return acc;
    }, {});

    console.log(totals[heatPointId]);

    const minTemp = 15;
    const maxTemp = 40;
    let valueSubstract = value;

    if (totals[heatPointId]) {
        valueSubstract -= totals[heatPointId];
    }

    const percentageValue = ((valueSubstract - minTemp) / (maxTemp - minTemp)) * 100;
    console.log(markers);
    console.log(heatPointId);
    console.log(percentageValue);



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
                    <p style={{fontSize: '2rem'}}><strong>{valueSubstract}°C</strong></p>
                </div>
            </div>
        </div>

    );
};

export default TemperatureBar;
