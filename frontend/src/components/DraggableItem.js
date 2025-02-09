import React from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableItem({ item, index, container, className, textClassName }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over
  } = useSortable({
    id: item.id,
    data: {
      index,
      container,
      item
    }
  });

  // Make the item droppable as well
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: item.id,
    data: {
      container,
      item,
      index
    }
  });

  // Combine the refs
  const setRefs = (node) => {
    setNodeRef(node);
    setDroppableRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    touchAction: 'none', // Prevent touch scrolling while dragging
    WebkitUserSelect: 'none',
    userSelect: 'none'
  };

  const isOverCurrent = over?.id === item.id;

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      {...listeners}
      className={`aspect-square flex items-center justify-center 
        ${isDragging ? 'shadow-lg z-50' : ''} 
        ${container === 'inventory' ? 'rounded-lg border-2 border-gray-200' : ''}
        transition-shadow duration-200 touch-none select-none w-[80px] h-[80px] relative`}
    >
      {item.image_url ? (
        <div className="w-full h-full flex items-center justify-center p-1">
          <img 
            src={item.image_url} 
            alt={item.display_name || item.item_name}
            className="max-w-full max-h-full object-contain"
            style={{ transform: 'scale(1.5)' }}
            draggable="false"
          />
        </div>
      ) : (
        <div className="text-center w-full">
          <span className={`font-medium break-words ${textClassName}`}>
            {item.display_name || item.item_name}
          </span>
          {item.group_name && (
            <span className="block text-xs text-gray-500 mt-1">
              {item.group_name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

DraggableItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    item_name: PropTypes.string.isRequired,
    display_name: PropTypes.string,
    group_name: PropTypes.string,
    image_url: PropTypes.string,
    position: PropTypes.number.isRequired,
    user_id: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  container: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  textClassName: PropTypes.string.isRequired
}; 