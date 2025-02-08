import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

function FridgeSlot({ position, item }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `fridge-slot-${position}`,
    data: {
      container: 'fridge',
      position: position,
      type: 'slot'
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`relative ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      {item ? (
        <DraggableItem
          item={item}
          index={position}
          container="fridge"
          className="bg-blue-50 border-blue-300"
          textClassName="text-blue-600"
        />
      ) : (
        <div
          className={`aspect-square bg-gray-100 rounded-lg border-2 border-dashed 
            ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} 
            flex items-center justify-center transition-colors duration-200`}
        >
          <span className="text-gray-400">Slot {position}</span>
        </div>
      )}
    </div>
  );
}

FridgeSlot.propTypes = {
  position: PropTypes.number.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    item_name: PropTypes.string,
    position: PropTypes.number,
    user_id: PropTypes.string
  })
};

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
    <div className="bg-white p-4 rounded-lg shadow">
      <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-4">
          {slots.map(({ position, item }) => (
            <FridgeSlot key={position} position={position} item={item} />
          ))}
        </div>
      </SortableContext>
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