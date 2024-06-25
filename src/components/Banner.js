"use client";

import React from 'react';
import styles from './Banner.module.css';

const Banner = ({ title, description, buttonText, onButtonClick }) => (
  <div className={styles.banner}>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
    <button className={styles.button} onClick={onButtonClick}>{buttonText}</button>
  </div>
);

export default Banner;
