import React from 'react';
import TemperatureBar from '../../components/temperature-bar/TemperatureBar';
import styles from '../../components/temperature-bar/TemperatureBar.module.css';

export default function TestTemperatureBar() {
    const impacts = [
        { label: "Évolution de la température estimée :", value: 25 }, // Example value in degrees
    ];

    return (
            <section className={styles.container}>
                {impacts.map((impact, index) => (
                    <div key={index} className={styles.item}>
                        <TemperatureBar
                            title={impact.label}
                            value={impact.value}
                        />
                    </div>
                ))}
                <div>
                    {impacts.map((impact, index) => (
                        <div key={index} className={styles.valueitem}>
                            {impact.value}°C
                        </div>
                    ))}
                </div>
            </section>
    );
}
