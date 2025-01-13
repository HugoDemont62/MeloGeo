import React, { useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Section2.module.css";

const Section2 = ({ title, description, imageUrl, reverse }) => {
  const sectionRef = useRef();

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