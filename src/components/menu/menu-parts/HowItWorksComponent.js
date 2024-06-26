import styles from "@/app/howitworks/Howitworks.module.css";
import React from "react";

export default function HowItWorksComponent() {

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src="/images/Simularbrehowitworkslogo.png" alt="Simularbre Logo"/>
                </div>
                <div className={styles.desc}>
                    <p>Simulateur de régulation arboricole des températures dans les villes</p>
                </div>
                <hr className={styles.separator}/>
            </header>
            <main className={styles.main}>
                <h2>Comment ça marche ?</h2>
                <div className={styles.step}>
                    <h3>Choisissez une ville</h3>
                    <p>C’est dans celle-ci que vous réaliserez la simulation.</p>
                </div>
                <div className={styles.step}>
                    <h3>Identifiez les zones de chaleur</h3>
                    <p>Trouvez les zones à problèmes sur la carte et remédiez-y.</p>
                </div>
                <div className={styles.step}>
                    <h3>Sélectionnez, et cliquez</h3>
                    <p>Plantez des arbres sur les emplacements recommandés.</p>
                </div>
                <div className={styles.step}>
                    <h3>Réalisez l’impact positif en direct</h3>
                    <p>Observez simultanément la chaleur locale se réduire, et comprenez les impacts des arbres plantés
                        en ville !</p>
                </div>
            </main>
        </div>
    )

}