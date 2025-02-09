import React from 'react';
import Navbar from '../../components/Navbar';
import styles from './prizepage.module.css';
import { Link } from 'react-router-dom';

export default function PrizePage() {
  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}/>


      <div className={styles.text}>
      <h1 className=" align-center justify-center text-4xl font-bold">
        Wow! </h1>
      <h1>You got fried chicken!</h1>
      <div/>
      <img className={styles.surprise} src="./Prize/surprise.png"></img>

      <img styleName={styles.chicken} src="./Prize/chicken.png"></img>


      </div>

      <Link to='/claim'>
      <button className="w-[25vw] h-[55px] bg-[#ffdc90] rounded-[50px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]
                   active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black
                   flex items-center justify-center align-center 
                   disabled:opacity-50 disabled:cursor-not-allowed"> Yay!</button>
      </Link>
      
      
    </div>
  );
} 