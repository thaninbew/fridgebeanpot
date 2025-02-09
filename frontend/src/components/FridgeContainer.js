import React from 'react';
import PropTypes from 'prop-types';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { FridgeSlot } from './FridgeSlot';

// Define positions for each of the 12 slots (as shown above)
const slotPositions = [
  { left: '24%', top: '20%' },
  { left: '50%', top: '20%' },
  { left: '76%', top: '20%' },
  { left: '24%', top: '41%' },
  { left: '50%', top: '41%' },
  { left: '76%', top: '41%' },
  { left: '24%', top: '63%' },
  { left: '50%', top: '63%' },
  { left: '76%', top: '63%' },
  { left: '24%', top: '84%' },
  { left: '50%', top: '84%' },
  { left: '76%', top: '84%' }

];

export default function FridgeContainer({ items }) {
  // Create an array of exactly 12 slots (0-11)
  const slots = Array.from({ length: 12 }, (_, index) => {
    const item = items.find(item => item.position === index);
    return {
      position: index,
      item: item || null
    };
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* SVG Background Container */}
      <div className="fixed w-full h-screen -z-10 left-1/2 -translate-x-1/2">
        <img 
          src="/fridge.svg" 
          alt="Fridge" 
          className="absolute w-full h-full object-contain transform scale-[2] mt-[-19%]"
        />
      </div>

      {/* Slots Container */}
      <div className="relative w-full pb-[120%]">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
              {slots.map(({ position, item }) => (
                <FridgeSlot 
                  key={position} 
                  position={position} 
                  item={item} 
                  slotPosition={slotPositions[position]} 
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>
    </div>
  );
}

FridgeContainer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      item_name: PropTypes.string,
      position: PropTypes.number,
      user_id: PropTypes.string
    })
  ).isRequired
};
