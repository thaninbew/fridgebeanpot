import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state?.restaurant;

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      navigate('/PrizePage', {state: {restaurant}}); // Navigate to prize page after delay
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [navigate, restaurant]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Bean mascot */}
      <div className="w-32 h-32 mb-8">
        <img src="/bean-fridge.svg" alt="Bean mascot" className="w-full h-full" />
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold mb-2">Verifying your location...</h2>
      <p className="text-gray-600 mb-8">Please give us a minute</p>

      {/* Loading bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#F4B942] rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
} 