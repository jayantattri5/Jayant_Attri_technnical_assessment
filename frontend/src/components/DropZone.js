// components/DropZone.js
// Central drop zone component for adding the first step
// --------------------------------------------------

import React from 'react';

export const DropZone = ({ 
  hasTrigger, 
  dragOverDropZone, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  onClick 
}) => {
  if (hasTrigger) return null;

  return (
    <div
      className={`drop-zone ${dragOverDropZone ? 'drag-over' : ''}`}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="plus-icon">+</div>
      <div className="plus-text">Add first step...</div>
    </div>
  );
};