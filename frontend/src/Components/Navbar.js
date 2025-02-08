import React, { useState } from 'react'
import { Link } from 'react-router-dom';


export default function Navbar () {
    const [activeButton, setActiveButton] = useState(false);

    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex);
    };

    return (
        
        <div className='flex items-center justify-center'>
        <div className=" fixed bottom-3 z-3 w-[95%] h-[73px] bg-[#f6bd60] rounded-[45.50px] border-2 border-black align flex justify-between;">
            <div className="flex items-center grid-cols-4 mx-auto">
                
                <Link to='#'>
                <button 
                    type="button" 
                    className="items-center justify-center px-5" 
                    onClick= {() => handleButtonClick(1) 
                    }
                >
                    <img 
                        src="/nav/fridge.svg" 
                        className={`${activeButton === 1 ? 'filter brightness-0' : ''}`} 
                    />
                </button>
                </Link>

                <Link to='/Inventory'>
                <button 
                    type="button" 
                    className="items-center justify-center px-6" 
                    onClick={() => handleButtonClick(2)}
                >
                    <img 
                        src="/nav/inventory.svg" 
                        className={`${activeButton === 2 ? 'filter brightness-0' : ''}`} 
                    />
                </button>
                </Link>
        
                <Link to='/Explore'>
                <button 
                    type="button" 
                    className="items-center justify-center px-6" 
                    onClick={() => handleButtonClick(3)}
                >
                    <img 
                        src="/nav/explore.svg" 
                        className={`${activeButton === 3 ? 'filter brightness-0' : ''}`} 
                    />
                </button>
                </Link>
             
                <Link to='/Profile'>
                <button 
                    type="button" 
                    className="items-center justify-center px-6" 
                    onClick={() => handleButtonClick(4)}
                >
                    <img 
                        src="/nav/profile.svg" 
                        className={`${activeButton === 4 ? 'filter brightness-0' : ''}`} 
                    />
                </button>
                </Link>
            </div>
        </div></div>
    );
}
