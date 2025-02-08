import React from 'react';

export default function InventoryContainer() {
  // For now, we'll create a static grid of 16 slots (4x4)
  const slots = Array(16).fill(null);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-4 gap-4">
        {slots.map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
          >
            <span className="text-gray-400">Empty</span>
          </div>
        ))}
      </div>
    </div>
  );
} 