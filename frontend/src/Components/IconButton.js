/** 
import React from 'react'
import { Link } from 'react-router-dom';


export default function(to, buttonIndex, icon) {

    return (
        <Link to={to}>
        <button 
            type="button" 
            className="items-center justify-center px-5" 
            onClick= {() => handleButtonClick(buttonIndex)}
        >
            <img 
                src={icon}
                className={`${activeButton === ButtonIndex ? 'filter brightness-0' : ''}`} 
            />
        </button>
        </Link>
    );
}
*/