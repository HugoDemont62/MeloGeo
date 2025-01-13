import React, { useEffect, useRef } from "react";
import styles from './Preloader.module.css';
import { gsap } from "gsap";
import Image from "next/image"; // Utilisation du composant Image
import Logo from '../../../public/images/landingPage/logoMeloGéo.png';

const Preloader = ({ onLoaded }) => {
  const preloaderRef = useRef();
  const logoRef = useRef();
  const loaderRef = useRef();

  useEffect(() => {
    // Timeline GSAP pour animer le preloader
    const tl = gsap.timeline({
      onComplete: onLoaded, // Appelé après la fin de l'animation
    });

    // Animations du preloader et du logo
    tl.to(preloaderRef.current, { opacity: 1, duration: 0.5 }) // Apparition du preloader
      .fromTo(
        logoRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out" } // Affichage du logo avec effet élastique
      )
      .to(loaderRef.current, { opacity: 1, duration: 0.5 }) // Apparition du loader
      .to(preloaderRef.current, { opacity: 0, duration: 0.8, delay: 1 }, "-=0.5"); // Disparition du preloader (et logo)

    return () => tl.kill(); // Nettoyage de la timeline
  }, [onLoaded]);

  return (
    <div ref={preloaderRef} className={styles.preloader}>
      <Image ref={logoRef} src={Logo} alt="Logo MeloGéo" className={styles.logo} />
    </div>
  );
};

export default Preloader;