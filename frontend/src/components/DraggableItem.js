import React from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableItem({ item, index, container, className, textClassName }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item.id,
    data: {
      index,
      container,
      item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`aspect-square rounded-lg border-2 ${className} flex items-center justify-center p-2 ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="text-center">
        <span className={`font-medium break-words ${textClassName}`}>
          {item.item_name}
        </span>
      </div>
    </div>
  );
}

DraggableItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    item_name: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    user_id: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  container: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  textClassName: PropTypes.string.isRequired
}; 