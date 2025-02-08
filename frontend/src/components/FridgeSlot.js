import { Droppable, Draggable } from 'react-beautiful-dnd';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FridgeSlot = ({ item, index, onRemove }) => {
  return (
    <Droppable droppableId={`fridge-slot-${index}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            h-16 w-full border-2 rounded-lg transition-all relative
            ${item ? 'bg-white' : 'border-dashed'}
            ${snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-blue-200 bg-gray-50'}
          `}
        >
          {item && (
            <Draggable draggableId={item.id} index={0}>
              {(dragProvided, dragSnapshot) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                  className="h-full flex items-center justify-between p-2"
                  style={dragProvided.draggableProps.style}
                >
                  <span className="font-medium">{item.item_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Slot {index + 1}</span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1 hover:bg-red-100 rounded-full text-red-500"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </Draggable>
          )}
          {!item && (
            <div className="h-full flex items-center justify-center text-gray-400">
              Empty Slot {index + 1}
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default FridgeSlot; 