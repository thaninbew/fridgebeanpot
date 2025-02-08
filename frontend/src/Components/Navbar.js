import React, { useState } from 'react'

export default function Navbar () {
    const [activeButton, setActiveButton] = useState(false);

    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex);
    };

    return (
        <div className="fixed bottom-3 z-3 w-[95%] h-[73px] bg-[#f6bd60] rounded-[45.50px] border-2 border-black align flex justify-between;">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                
                <button 
                    type="button" 
                    className="items-center justify-center px-6" 
                    onClick={() => handleButtonClick(1)}
                >
                    <img 
                        src="/nav/fridge.svg" 
                        alt="Inventory" 
                        className={`${activeButton === 1 ? 'filter brightness-0' : ''}`} 
                    />
                </button>

      
                <button 
                    type="button" 
                    className="items-center justify-center px-6" 
                    onClick={() => handleButtonClick(2)}
                >
                    <img 
                        src="/nav/inventory.svg" 
                        alt="Inventory" 
                        className={`${activeButton === 2 ? 'filter brightness-0' : ''}`} 
                    />
                </button>

        
                <button 
                    type="button" 
                    className="items-center justify-center px-6" 
                    onClick={() => handleButtonClick(3)}
                >
                    <img 
                        src="/nav/explore.svg" 
                        alt="Explore" 
                        className={`${activeButton === 3 ? 'filter brightness-0' : ''}`} 
                    />
                </button>

             
                <button 
                    type="button" 
                    className="items-center justify-center px-6" 
                    onClick={() => handleButtonClick(4)}
                >
                    <img 
                        src="/nav/profile.svg" 
                        alt="Profile" 
                        className={`${activeButton === 4 ? 'filter brightness-0' : ''}`} 
                    />
                </button>
            </div>
        </div>
    );
}
