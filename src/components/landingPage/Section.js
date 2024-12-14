import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Section.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Section = ({ title, description, imageUrl, reverse }) => {
  const sectionRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation lors de l'apparition de la section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 100 }, // Initial : masqué et légèrement décalé en bas
      {
        opacity: 1,
        y: 0, // Final : complètement visible à sa position d'origine
        duration: 1, // Durée de l'animation
        ease: "power3.out", // Transition fluide
        scrollTrigger: {
          trigger: sectionRef.current, // Déclencheur : La section elle-même
          start: "top 80%", // Début de l'animation : lorsque le haut de la section entre dans le viewport
        },
      }
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      id="sensibiliser"
      className={`${styles.sectionContainer} ${reverse ? styles.flexRowReverse : ''}`}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.image}>
        <img src={imageUrl} alt={`Image for ${title}`} className={styles.imageElement} />
      </div>
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
};

Section.defaultProps = {
  reverse: false,
};

export default Section;