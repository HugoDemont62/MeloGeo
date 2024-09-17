"use client";

import React from 'react';
import styles from './Banner.module.css';
import Link from "next/link";

const Banner = ({ title, description, buttonText, onButtonClick }) => (
  <div className={styles.banner}>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
      <Link href="/map"><button className={styles.button} onClick={onButtonClick}>{buttonText}</button></Link>
  </div>
);

export default Banner;
