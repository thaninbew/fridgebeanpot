import React, { useState } from 'react';
import Navbar from "../../components/Navbar";

export default function ExploreNavBar() {
  const initialTab = window.location.pathname === '/explore' ? 'explore' : 'map';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleNavClick = (tab, url) => {
    setActiveTab(tab);
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center m-auto py-12">
      <div className="w-[80vw] h-[9vh] relative bg-[#f7f6f4] rounded-[50px] border-2 border-black mt-10 mb-10">
        <div
          className={`absolute top-0 bottom-0 w-1/2 bg-[#84a59d] rounded-[50px] transition-transform duration-300 ${
            activeTab === 'map' ? 'translate-x-full' : 'translate-x-0'
          }`}
        ></div>

        <div className="flex h-full relative">
          <button
            onClick={() => handleNavClick('explore', '/explore')}
            className={`flex-1 text-center font-bold text-[25px] ${
              activeTab === 'explore' ? 'text-black' : 'text-[#9e9e9e]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => handleNavClick('map', '/map')}
            className={`flex-1 text-center font-bold text-[25px] ${
              activeTab === 'map' ? 'text-black' : 'text-[#9e9e9e]'
            }`}
          >
            Map
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
}