import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import DraggableItem from './DraggableItem';

export function FridgeSlot({ position, item, slotPosition }) {
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
      className={`absolute w-[80px] h-[80px] transition-all ${isOver ? 'ring-2 ring-blue-400' : ''}`}
      style={{
        left: slotPosition.left,
        top: slotPosition.top,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {item ? (
        <DraggableItem
          item={item}
          index={position}
          container="fridge"
          className="bg-white/80 backdrop-blur-sm border-gray-300"
          textClassName="text-black"
        />
      ) : (
        <div
          className={`aspect-square bg-white/30 backdrop-blur-sm rounded-lg border-2 border-dashed 
            ${isOver ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300'} 
            flex items-center justify-center transition-colors duration-200`}
        >
          <span className="text-gray-400 text-sm">Empty</span>
        </div>
      )}
    </div>
  );
}

FridgeSlot.propTypes = {
  position: PropTypes.number.isRequired,
  slotPosition: PropTypes.shape({
    left: PropTypes.string.isRequired,
    top: PropTypes.string.isRequired
  }).isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    item_name: PropTypes.string,
    display_name: PropTypes.string,
    group_name: PropTypes.string,
    image_url: PropTypes.string,
    position: PropTypes.number,
    user_id: PropTypes.string
  })
};
