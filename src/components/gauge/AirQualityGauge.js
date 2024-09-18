import React, { useState, useEffect } from 'react';
import { GaugeComponent } from 'react-gauge-component';

const AirQualityGauge = ({ airPollution }) => {
    const [jaugeValue, setJaugeValue] = useState(50);
    const [etatAir, setEtatAir] = useState('');

    useEffect(() => {
        if (airPollution.list) {
            const aqi = airPollution.list[0].main.aqi;

            if (aqi === 1 || aqi === 2) {
                setJaugeValue(15); // AQI faible
                setEtatAir('Bon');
            }

            if (aqi === 3) {
                setJaugeValue(37); // AQI moyen
                setEtatAir('Moyen');
            }

            if (aqi >= 4) {
                setJaugeValue(80); // AQI élevé
                setEtatAir('Mauvais');
            }
        }
    }, [airPollution]);

    return (
        <div style={{ width: '200px', minHeight: '200px' }}>
            <p style={{ textAlign: 'center' }}>
                <strong>Qualité de l'air</strong>
            </p>

            <GaugeComponent
                value={jaugeValue}
                type="radial"
                arc={{
                    colorArray: ['#28b0ea', '#EA4228'], // Palette globale, non obligatoire si chaque subArc a une couleur
                    subArcs: [
                        { limit: 10, color: '#28b0ea' },   // Très bon (bleu)
                        { limit: 30, color: '#7ec889' },   // Moyen (vert clair)
                        { limit: 50, color: '#ffdf6b' },   // Mauvais (jaune)
                        { limit: 70, color: '#EA4228' },   // Très Mauvais (rouge)
                        { color: '#702929' }               // Critique (rouge foncé)
                    ],
                    padding: 0.02,
                    width: 0.2
                }}
                pointer={{
                    elastic: true,
                    animationDelay: 0
                }}
            />

            <p style={{ textAlign: 'center' }}>
                <strong>État de l'air :</strong> {etatAir}
            </p>
        </div>
    );
};

export default AirQualityGauge;
