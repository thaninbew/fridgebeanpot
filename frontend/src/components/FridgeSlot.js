import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import DraggableItem from './DraggableItem';

export function FridgeSlot({ position, item, slotPosition, isDragging }) {
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
      className={`absolute w-[80px] h-[80px] transition-all`}
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
          className=""
          textClassName="text-black"
        />
      ) : (
        <div
  ref={setNodeRef}
  className={`aspect-square w-[80px] h-[80px] flex items-center justify-center transition-colors duration-200
    ${isOver ? 'border-2 border-[#f6bd60] bg-[#f6bd60]/40' : ''}
    ${!isOver && isDragging ? 'border-2 border-dashed rounded-lg border-gray-600' : ''}
  `}
/>

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
  }),
  isDragging: PropTypes.bool.isRequired
};
