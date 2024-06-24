import React from 'react';
import PropTypes from 'prop-types';
import styles from './Section3.module.css';

const Section3 = ({ title, description, imageUrl, reverse }) => (
  <div className={`${styles.sectionContainer} ${reverse ? styles.flexRowReverse : ''}`}>
    <div className={styles.content}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
    <div className={styles.image}>
      <img src={imageUrl} alt={`Image for ${title}`} className={styles.imageElement} />
    </div>
  </div>
);

Section3.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
};

Section3.defaultProps = {
  reverse: false,
};

export default Section3;
