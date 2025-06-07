// components/TriggerContainer.js
// Trigger container with controls and add node functionality
// --------------------------------------------------

import React from 'react';

export const TriggerContainer = ({ 
  droppedTrigger, 
  onDeleteTrigger, 
  onToggleActive, 
  onPlayPause, 
  onAddNode 
}) => {
  if (!droppedTrigger) return null;

  return (
    <div className="trigger-container">
      <div className="trigger-with-plus">
        <div className="trigger-node">
          <div className="trigger-icon">
            {droppedTrigger.icon}
          </div>
          <div className="trigger-controls">
            <button 
              className="control-btn delete-btn" 
              onClick={onDeleteTrigger}
              title="Delete"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
              </svg>
            </button>
            <button 
              className="control-btn toggle-btn" 
              onClick={onToggleActive}
              title="Activate/Deactivate"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                <path d="m1 7 4 4 4-4"/>
              </svg>
            </button>
            <button 
              className="control-btn play-btn" 
              onClick={onPlayPause}
              title="Play/Pause"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Plus button to add nodes */}
        <div 
          className="add-node-plus"
          onClick={onAddNode}
          title="Add node"
        >
          <div className="plus-icon">+</div>
        </div>
      </div>
      
      <div className="trigger-label">
        When clicking 'Execute workflow'
      </div>
    </div>
  );
};