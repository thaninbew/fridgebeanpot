import React, { useState } from 'react'
import { TbFridge } from "react-icons/tb";
import styles from "./Navbar.module.css";

export default function Navbar () {
    // State to track the active button
    const [activeButton, setActiveButton] = useState(null);

    // Function to handle button click and set the active button
    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex);
    };

    return (
        <button 
            type="button" 
            className="items-center justify-center px-6" 
            onClick={() => handleButtonClick(1)}
        >
            <TbFridge className={`${styles.icon} ${activeButton === 1 ? 'text-blue-500' : 'text-[#D69B3C]'}`} />
        </button>
    );
}
