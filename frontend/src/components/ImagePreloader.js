import React, { useEffect } from 'react';

const imagesToPreload = [
  '/nav/fridge.svg',
  '/nav/inventory.svg',
  '/nav/explore.svg',
  '/nav/profile.svg',
  '/fridge.svg',
  '/bean-fridge.svg',
  '/freaky-bean.svg',
  '/logo192.png',
  '/logo512.png'
];

export default function ImagePreloader() {
  useEffect(() => {
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Return null as this is a utility component
  return null;
} 