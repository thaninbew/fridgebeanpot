import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

export default function InventoryContainer({ items, isOpen }) {
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
      className={`fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ height: '85vh' }}
    >
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold mb-6">Inventory</h2>
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
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
  ).isRequired,
  isOpen: PropTypes.bool.isRequired
}; 