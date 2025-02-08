import React from 'react';
import FridgeContainer from '../components/FridgeContainer';
import InventoryContainer from '../components/InventoryContainer';

export default function FridgePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Fridge</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Fridge Storage</h2>
          <FridgeContainer />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
          <InventoryContainer />
        </div>
      </div>
    </div>
  );
} 