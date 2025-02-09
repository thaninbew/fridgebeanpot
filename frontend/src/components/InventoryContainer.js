import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

export default function InventoryContainer({ items, isOpen, onClose }) {
  const { setNodeRef } = useDroppable({
    id: 'inventory',
    data: {
      container: 'inventory'
    }
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div
        ref={setNodeRef}
        className={`fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-out z-20 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '80vh' }}
      >
        {/* Close button - positioned relative to viewport */}
        <button
          onClick={onClose}
          className="fixed right-6 bottom-6 bg-[#f6bd60] rounded-full p-6 shadow-lg hover:bg-[#f7c675] transition-colors z-30"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-6 pb-20">
          <h2 className="text-2xl font-bold mb-4">Inventory</h2>
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-xl text-gray-500">Your inventory is empty!</p>
            </div>
          ) : (
            <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
              <div 
                className="grid grid-cols-2 gap-4 overflow-y-auto pr-3" 
                style={{ maxHeight: 'calc(80vh - 120px)' }}
              >
                {items.map((item) => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    index={item.position}
                    container="inventory"
                    className="bg-green-50 border-green-300"
                    textClassName="text-green-600"
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </>
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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}; 