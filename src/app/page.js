"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../components/landingPage/Header';
import Footer from '../components/landingPage/Footer';
import Banner from '../components/landingPage/Banner';
import Section from '../components/landingPage/Section';
import Section2 from '../components/landingPage/Section2';
import Section3 from '../components/landingPage/Section3';
import Preloader from '@/components/landingPage/Preloader';
import styles from './page.module.css'; // Styles spécifiques à la page, optionnel
import MaintenanceBanner from './MaintenanceBanner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le Preloader

  const handleLoaded = () => {
    setIsLoading(false); // Changer l'état à false une fois le chargement terminé
  };

  return (
    <>
      {isLoading && <Preloader onLoaded={handleLoaded} />} {/* Affiche le preloader */}
      {!isLoading && (
        <>
          <main className={styles.main}>
            {/* Bannière */}
            <Banner
              title="MeloGéo"
              description="Explorez la planète à travers une symphonie de paysages et de climats"
              buttonText="Commencer une exploration"
            />
            <MaintenanceBanner />

            {/* Intégration des sections */}
            <Section
              title="Exploration Musicale"
              description="Découvrez comment les données géographiques et météorologiques se transforment en une symphonie immersive. Explorez les paysages du monde à travers des compositions musicales uniques, où chaque région offre une expérience sonore distincte, révélant la beauté cachée de notre planète."
              imageUrl="/images/landingPage/soleil.png"
              reverse={false}
            />
            <Section2
              title="Analyse Climatique"
              description="Visualisez en temps réel comment les conditions météorologiques influencent la musique générée par votre voyage. Simulatez l'impact des variations climatiques sur les compositions musicales, et identifiez les régions où le climat crée les mélodies les plus fascinantes."
              imageUrl="/images/landingPage/flat-black-speaker-background.png"
              reverse={false}
            />
            <Section3
              title="Voyage Sonore"
              description="Embarquez pour un voyage sonore à travers le monde avec 'Symphonie Géographique'. En utilisant les données climatiques et géographiques, cette expérience vous permet de comprendre comment le climat façonne la musique et comment chaque région peut contribuer à une symphonie globale, soulignant l'interconnexion entre notre environnement et les arts."
              imageUrl="/images/landingPage/nuit.png"
              reverse={false}
            />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}