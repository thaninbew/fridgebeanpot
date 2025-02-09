import React from 'react';
import Navbar from '../components/Navbar';
import styles from './prizepage.module.css';

export default function PrizePage() {
  return (
    <div>
      <img className={styles.surprise} src="./Prize/surprise.png"></img>
      <h1 className="text-4xl font-bold mb-8 mt-10 pl-4">Wow! </h1>
      <p>You got fried chicken!</p>

      <button className={styles.button}> Yay!</button>

      

      <Navbar />
    </div>
  );
} 