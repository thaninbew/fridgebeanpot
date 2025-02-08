import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

export default function InventoryContainer({ items }) {
  const { setNodeRef } = useDroppable({
    id: 'inventory',
    data: {
      container: 'inventory'
    }
  });

  // Create an array of 16 slots, filled with items at their positions
  const slots = Array(16).fill(null).map((_, index) => {
    return items.find(item => item.position === index) || null;
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white p-4 rounded-lg shadow"
    >
      <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-4 gap-4">
          {slots.map((item, index) => (
            <div key={index}>
              {item ? (
                <DraggableItem
                  item={item}
                  index={index}
                  container="inventory"
                  className="bg-green-50 border-green-300"
                  textClassName="text-green-600"
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