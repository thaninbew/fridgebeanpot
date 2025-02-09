import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Navbar({ onInventoryClick, isInventoryOpen }) {
    const [activeButton, setActiveButton] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Reset active button when inventory closes
    useEffect(() => {
        if (!isInventoryOpen && activeButton === 2) {
            setActiveButton(false);
        }
    }, [isInventoryOpen]);

    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex);
    };

    const handleInventoryClick = () => {
        if (!isInventoryOpen) {
            handleButtonClick(2);
            if (location.pathname !== '/fridge') {
                // Navigate to fridge with state indicating to open inventory
                navigate('/fridge', { state: { openInventory: true } });
            } else {
                onInventoryClick();
            }
        }
    };

    return (
        <div className='flex items-center justify-center'>
            <div className="fixed bottom-3 z-3 w-[95%] h-[73px] bg-[#f6bd60] rounded-[45.50px] border-2 border-black align flex justify-between;">
                <div className="flex items-center grid-cols-4 mx-auto">
                    
                    <Link to='/fridge'>
                        <button 
                            type="button" 
                            className="items-center justify-center px-5" 
                            onClick={() => handleButtonClick(1)}
                        >
                            <img 
                                src="/nav/fridge.svg" 
                                alt="Fridge"
                                className={`${activeButton === 1 || location.pathname === '/fridge' ? 'filter brightness-0' : ''}`} 
                            />
                        </button>
                    </Link>

                    <button 
                        type="button" 
                        className="items-center justify-center px-6" 
                        onClick={handleInventoryClick}
                    >
                        <img 
                            src="/nav/inventory.svg" 
                            alt="Inventory"
                            className={`${isInventoryOpen ? 'opacity-50' : activeButton === 2 ? 'filter brightness-0' : ''}`} 
                        />
                    </button>

                    <Link to='/explore'>
                        <button 
                            type="button" 
                            className="items-center justify-center px-6" 
                            onClick={() => handleButtonClick(3)}
                        >
                            <img 
                                src="/nav/explore.svg" 
                                alt="Explore"
                                className={`${activeButton === 3 || location.pathname === '/explore' ? 'filter brightness-0' : ''}`} 
                            />
                        </button>
                    </Link>

                    <Link to='/profile'>
                        <button 
                            type="button" 
                            className="items-center justify-center px-6" 
                            onClick={() => handleButtonClick(4)}
                        >
                            <img 
                                src="/nav/profile.svg" 
                                alt="Profile"
                                className={`${activeButton === 4 || location.pathname === '/profile' ? 'filter brightness-0' : ''}`} 
                            />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

Navbar.propTypes = {
    onInventoryClick: PropTypes.func.isRequired,
    isInventoryOpen: PropTypes.bool
};
