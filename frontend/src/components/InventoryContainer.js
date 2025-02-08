import React from 'react';
import PropTypes from 'prop-types';

export default function InventoryContainer({ items }) {
  // Create an array of 16 slots, filled with items at their positions
  const slots = Array(16).fill(null).map((_, index) => {
    return items.find(item => item.position === index) || null;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-4 gap-4">
        {slots.map((item, index) => (
          <div
            key={index}
            className={`aspect-square rounded-lg border-2 ${
              item ? 'bg-green-50 border-green-300' : 'bg-gray-100 border-dashed border-gray-300'
            } flex items-center justify-center p-2`}
          >
            {item ? (
              <div className="text-center">
                <span className="text-green-600 font-medium break-words">
                  {item.item_name}
                </span>
              </div>
            ) : (
              <span className="text-gray-400">Empty</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

InventoryContainer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      item_name: PropTypes.string,
      position: PropTypes.number,
      user_id: PropTypes.string
    })
  ).isRequired
}; 