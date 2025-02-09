import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
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
        // Use the provided slotPosition values
        left: slotPosition.left,
        top: slotPosition.top,
        transform: 'translate(-50%, -50%)' // Center the slot relative to the given point
      }}
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
          <span className="text-gray-400 text-sm">Slot {position}</span>
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
  }),
  slotPosition: PropTypes.shape({
    left: PropTypes.string,
    top: PropTypes.string
  }).isRequired
};
