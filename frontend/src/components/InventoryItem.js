import { Draggable } from 'react-beautiful-dnd';

const InventoryItem = ({ item, index }) => {
  return (
    <Draggable draggableId={item.id} index={index} type="ITEM">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            h-12 border border-green-200 rounded-lg p-2 mb-2 
            bg-white transition-all select-none
            ${snapshot.isDragging ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'}
          `}
          style={provided.draggableProps.style}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">{item.item_name}</span>
            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
              Drag to fridge
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default InventoryItem; 