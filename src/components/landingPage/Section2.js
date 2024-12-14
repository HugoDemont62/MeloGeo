import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Section2.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Section2 = ({ title, description, imageUrl, reverse }) => {
  const sectionRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation d'entrée au défilement
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 100 }, // Initial : masqué et en bas
      {
        opacity: 1,
        y: 0, // Final : visible et à sa position originale
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`${styles.sectionContainer} ${reverse ? styles.flexRowReverse : ""}`}
    >
      <div className={styles.image}>
        <img src={imageUrl} alt={`Illustration de ${title}`} className={styles.imageElement} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

Section2.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
};

export default Section2;