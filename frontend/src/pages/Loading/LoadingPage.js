import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      navigate('/PrizePage'); // Navigate to prize page after delay
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Pear mascot */}
      <div className="w-32 h-32 mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 20 C60 20, 80 40, 80 70 Q80 100, 50 100 Q20 100, 20 70 C20 40, 40 20, 50 20"
            fill="#FFD700"
          />
          {/* Eyes */}
          <circle cx="40" cy="50" r="5" fill="black" />
          <circle cx="60" cy="50" r="5" fill="black" />
          {/* Leaf */}
          <path
            d="M50 20 C50 20, 55 10, 60 15"
            stroke="#4CAF50"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold mb-4">Verifying your location...</h2>
      <p className="text-gray-600 mb-8">Please give us a minute</p>

      {/* Loading bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#FFD700] rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
} 