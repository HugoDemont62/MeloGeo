import styles from "@/app/howitworks/Howitworks.module.css";
import React from "react";

export default function HowItWorksComponent() {

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src="/images/landingPage/logoMeloGéoBlack.png" alt="logo"/>
                </div>
                <div className={styles.desc}>
                    <p>Voyage symphonique à travers la planète</p>
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
                    <h3>Observez la météo local</h3>
                    <p>Visualisez la météo locale de la ville en temps réel.</p>
                </div>
                <div className={styles.step}>
                    <h3>Sélectionnez, cliquez et écoutez</h3>
                    <p>Choisissez une villes et écoutez la musique générée par les données météorologiques de la ville</p>
                </div>
                <div className={styles.step}>
                    <h3>Explorez la planète</h3>
                    <p>Explorez la planète à travers une symphonie de paysages et de climats</p>
                </div>
            </main>
        </div>
    )

}