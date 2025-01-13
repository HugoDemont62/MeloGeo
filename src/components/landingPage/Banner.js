import 'boxicons/css/boxicons.min.css'; // Import Boxicons uniquement pour ce composant
import React, { useEffect, useRef, useState } from 'react';
import styles from './Banner.module.css';
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import Logo from '../../../public/images/landingPage/logoMeloGéo.png';

const Banner = ({ description, buttonText, onButtonClick }) => {
  const [isMobile, setIsMobile] = useState(false); // État pour détecter la vue mobile
  const bannerRef = useRef();
  const logoRef = useRef();
  const descriptionRef = useRef();
  const buttonRef = useRef();
  const arrowRef = useRef();

  useEffect(() => {
    // Détection de la vue mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initialiser au chargement
    window.addEventListener('resize', handleResize); // Écoute les changements de taille de fenêtre

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

      tl.fromTo(bannerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 });
      tl.fromTo(
          logoRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      );
      tl.fromTo(
          descriptionRef.current,
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1 }
      );
      tl.fromTo(
          buttonRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "bounce.out" }
      );
      if (arrowRef.current) {
        tl.fromTo(arrowRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
        gsap.to(arrowRef.current, {
          y: 15,
          repeat: -1,
          yoyo: true,
          duration: 1,
          ease: "power1.inOut",
        });
      }
    }
  }, [isMobile]);

  return (
      <div ref={bannerRef} className={styles.banner}>
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

        <p ref={descriptionRef} className={styles.description}>
          {description}
        </p>

        <Link href="/map">
          <button ref={buttonRef} className={styles.button} onClick={onButtonClick}>
            {buttonText}
          </button>
        </Link>

        {!isMobile && ( // Affiche la flèche uniquement si ce n'est pas une vue mobile
            <div ref={arrowRef} className={styles.scrollArrow}>
              <i className="bx bxs-down-arrow"></i>
            </div>
        )}
      </div>
  );
};

export default Banner;
