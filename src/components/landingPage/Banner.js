import 'boxicons/css/boxicons.min.css'; // Import Boxicons uniquement pour ce composant
import React, { useEffect, useRef } from 'react';
import styles from './Banner.module.css';
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import Logo from '../../../public/images/landingPage/logoMeloGéo.png';

const Banner = ({ description, buttonText, onButtonClick }) => {
  // Références pour les animations GSAP
  const bannerRef = useRef(); // Pour le conteneur global
  const logoRef = useRef(); // Pour le logo
  const descriptionRef = useRef(); // Pour la description
  const buttonRef = useRef(); // Pour le bouton
  const arrowRef = useRef(); // Pour la flèche de scroll

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

    // Animation pour le conteneur global (fade-in)
    tl.fromTo(bannerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 });

    // Animation pour le logo (scale avec effet élastique)
    tl.fromTo(
      logoRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" },
    );

    // Animation pour la description (slide-up)
    tl.fromTo(
      descriptionRef.current,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1 },
    );

    // Animation pour le bouton (pop-up)
    tl.fromTo(
      buttonRef.current,
      { scale: 0 },
      { scale: 1, duration: 0.5, ease: "bounce.out" },
    );

    // Animation pour la flèche (fade-in et rebond continu)
    tl.fromTo(arrowRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });

    // Bouncing effect on the arrow
    gsap.to(arrowRef.current, {
      y: 15,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div ref={bannerRef} className={styles.banner}>
      {/* Logo avec animation */}
      <div ref={logoRef} className={styles.logoContainer}>
        <Image
          src={Logo}
          alt="Logo MeloGéo"
          className={styles.logo}
          width={600}
          height={200}
          priority={true}
        />
      </div>

      {/* Description avec GSAP */}
      <p ref={descriptionRef} className={styles.description}>
        {description}
      </p>

      {/* Bouton animé */}
      <Link href="/map">
        <button ref={buttonRef} className={styles.button} onClick={onButtonClick}>
          {buttonText}
        </button>
      </Link>

      {/* Flèche avec GSAP et Boxicons */}
      <div ref={arrowRef} className={styles.scrollArrow}>
        <i className="bx bxs-down-arrow"></i>
      </div>
    </div>
  );
};

export default Banner;