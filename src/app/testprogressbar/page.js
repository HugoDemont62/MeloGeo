import React from 'react';
import ProgressBar from '../../components/progressbar/Progressbar';
import styles from '../../components/progressbar/ProgressBar.module.css';

export default function TestPage() {
    const impacts = [
        { label: "Régulation de l'ombre", value: 60 },
        { label: "Régulation de la qualité de l'air", value: 70 },
        { label: "Support de biodiversité", value: 80 },
    ];

    const limits = "Arbre de grande dimension. Il est susceptible d’entraîner des dépôts salissants sur le sol.";

    return (
        <main className={styles.main}>
            <section className={styles.container}>
                {impacts.map((impact, index) => (
                    <div key={index} className={styles.item}>
                        <ProgressBar
                            title={impact.label}
                            value={impact.value}
                        />
                    </div>
                ))}
                <div className={styles.limits}>
                    <span>Limites</span>
                    <div className={styles.limitContent}>
                        <span>😞</span>
                        <span>{limits}</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
