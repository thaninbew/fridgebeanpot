import React, {useState, useEffect, useRef} from 'react';
import Navbar from '../../components/Navbar';
import styles from './prizepage.module.css';
import { Link, useLocation } from 'react-router-dom';
import { claimsHandler } from '../../lib/claims.ts';

export default function PrizePage() {
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  const [item, setItem] = useState({});
  const hasClaimedRef = useRef(false);
  
  useEffect(() => {
    if (restaurant && !hasClaimedRef.current) {
      hasClaimedRef.current = true;
      claimsHandler.claimRestaurant(restaurant).then(setItem);
    }
  }, [restaurant]); // Only re-run if restaurant changes
  
  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}/>

      <div className={styles.text}>
      <h1 className="align-center justify-center text-4xl font-bold">
        Wow!</h1>
      <h1>You got {item.display_name}!</h1>
      <div/>
      <img className={styles.surprise} src="./Prize/surprise.png" alt="Surprise icon"/>

      <img className={styles.chicken} src={item.image_url} alt="Prize item"/>

      <Link to='/claim'>
        <button className="w-[25vw] h-[55px] bg-[#ffdc90] rounded-[50px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]
                   active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black
                   items-center justify-center align-center 
                   disabled:opacity-50 disabled:cursor-not-allowed m-[80px]">
          Yay!
        </button>
      </Link>
      </div>
    </div>
  );
} 