import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

export default function FridgeContainer({ items }) {
  const { setNodeRef } = useDroppable({
    id: 'fridge',
    data: {
      container: 'fridge'
    }
  });

  // Create an array of 12 slots, filled with items at their positions
  const slots = Array(12).fill(null).map((_, index) => {
    return items.find(item => item.position === index) || null;
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white p-4 rounded-lg shadow"
    >
      <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-4">
          {slots.map((item, index) => (
            <div key={index}>
              {item ? (
                <DraggableItem
                  item={item}
                  index={index}
                  container="fridge"
                  className="bg-blue-50 border-blue-300"
                  textClassName="text-blue-600"
                />
              ) : (
                <div
                  className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                >
                  <span className="text-gray-400">Empty</span>
                </div>
              )}
            </div>
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