import React from 'react';
import Image from 'next/image';
import Header from '../components/landingPage/Header';
import Footer from '../components/landingPage/Footer';
import Banner from '../components/landingPage/Banner';
import Section from '../components/landingPage/Section';
import Section2 from '../components/landingPage/Section2';
import Section3 from '../components/landingPage/Section3';
import styles from './page.module.css'; // Styles spécifiques à la page, optionnel

export default function Home() {
    
  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Bannière */}
        <Banner
          title="Melody Quest"
          description="Explorez la planète à travers une symphonie de paysages et de climats"
          buttonText="Commencer une exploration"
        />

      {/* Intégration de vos sections */}
      <Section
        title="Exploration Musicale"
        description="Découvrez comment les données géographiques et météorologiques se transforment en une symphonie immersive. Explorez les paysages du monde à travers des compositions musicales uniques, où chaque région offre une expérience sonore distincte, révélant la beauté cachée de notre planète."
        imageUrl="/images/landingPage/soleil.png"
        reverse={false} // ou true selon vos besoins
      />
      <Section2
        title="Analyse Climatique"
        description="Visualisez en temps réel comment les conditions météorologiques influencent la musique générée par votre voyage. Simulatez l'impact des variations climatiques sur les compositions musicales, et identifiez les régions où le climat crée les mélodies les plus fascinantes."
        imageUrl="/images/landingPage/flat-black-speaker-background.png"
        reverse={false} // ou true selon vos besoins
      />
      <Section3
        title="Voyage Sonore"
        description="Embarquez pour un voyage sonore à travers le monde avec 'Symphonie Géographique'. En utilisant les données climatiques et géographiques, cette expérience vous permet de comprendre comment le climat façonne la musique et comment chaque région peut contribuer à une symphonie globale, soulignant l'interconnexion entre notre environnement et les arts."
        imageUrl="/images/landingPage/soleil.png"
        reverse={false} // ou true selon vos besoins
      />
      </main>
      <Footer />
    </>
  );
}
