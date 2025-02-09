import React from 'react';
import Navbar from '../../components/Navbar';
import styles from './prizepage.module.css';

export default function PrizePage() {
  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}/>
      <img className={styles.surprise} src="./Prize/surprise.png"></img>
      <h1 className="absolute text-4xl font-bold self-center mb-8 mt-10 pl-4">
        Wow! </h1>
      <h1>You got fried chicken!</h1>
      <div/>

      <button className={styles.button}> Yay!</button>

      

      
    </div>
  );
} 