import { Droppable } from 'react-beautiful-dnd';
import InventoryItem from './InventoryItem';

const Inventory = ({ items }) => {
  return (
    <div className="w-64 p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Inventory</h2>
      <div className="text-sm text-gray-600 mb-4">
        {items.length} items available
      </div>
      <Droppable droppableId="inventory" type="ITEM">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 max-h-[600px] overflow-y-auto pr-2"
          >
            {items.map((item, index) => (
              <InventoryItem
                key={item.id}
                item={item}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Inventory; 