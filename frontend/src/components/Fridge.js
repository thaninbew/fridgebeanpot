import { Droppable } from 'react-beautiful-dnd';
import FridgeSlot from './FridgeSlot';

const Fridge = ({ items, onRemoveItem }) => {
  // Create array of 12 slots, filled with items where they exist
  const slots = Array(12).fill(null).map((_, index) => 
    items.find(item => item.position === index) || null
  );

  return (
    <div className="w-96 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">My Fridge</h2>
      <div className="text-sm text-gray-600 mb-4">
        {items.length}/12 slots filled
      </div>
      <div className="grid grid-cols-3 gap-4">
        {slots.map((item, index) => (
          <FridgeSlot
            key={index}
            item={item}
            index={index}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Fridge; 