import React from 'react';
import Navbar from '../../components/Navbar';
import styles from './prizepage.module.css';
import { Link } from 'react-router-dom';

export default function PrizePage() {
  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}/>
      <img className={styles.surprise} src="./Prize/surprise.png"></img>
      <h1 className=" align-center justify-center text-4xl font-bold">
        Wow! </h1>
      <h1>You got fried chicken!</h1>
      <div/>

      <img styleName={styles.chicken} src="./Prize/chicken.png"></img>

      <Link to='/claim'>
      <button styleName={"background:white"} className={styles.button}> Yay!</button>
      </Link>
      

      
    </div>
  );
} 