// components/TriggerNode.js
// Proper ReactFlow trigger node component
// --------------------------------------------------
import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { ParameterModal } from './ParameterModal';

export const TriggerNode = ({ data, id, selected }) => {
  const [showControls, setShowControls] = useState(false);
  const [showParameterModal, setShowParameterModal] = useState(false);
  const deleteTriggerNode = useStore(state => state.deleteTriggerNode);
  const updateNodeData = useStore(state => state.updateNodeData);

  const { trigger } = data;

  const handleDoubleClick = useCallback(() => {
    setShowParameterModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowParameterModal(false);
  }, []);

  const handleSaveParameters = useCallback((nodeId, parameters) => {
    if (updateNodeData) {
      updateNodeData(nodeId, parameters);
    }
  }, [updateNodeData]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (deleteTriggerNode) {
      deleteTriggerNode();
    }
  }, [deleteTriggerNode]);

  const handleToggleActive = useCallback((e) => {
    e.stopPropagation();
    // Implement toggle active logic
    console.log('Toggle active');
  }, []);

  const handlePlayPause = useCallback((e) => {
    e.stopPropagation();
    // Implement play/pause logic
    console.log('Play/Pause');
  }, []);

  return (
    <>
      <div 
        className={`trigger-node-container ${selected ? 'selected' : ''}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onDoubleClick={handleDoubleClick}
      >
        {/* Node Controls - similar to IconNode */}
        {showControls && (
          <div className="trigger-node-controls">
            <button className="trigger-control-btn delete-btn" onClick={handleDelete}>
              ×
            </button>
            <button className="trigger-control-btn toggle-btn" onClick={handleToggleActive}>
              ⚡
            </button>
            <button className="trigger-control-btn play-btn" onClick={handlePlayPause}>
              ▶
            </button>
          </div>
        )}

        <div className="trigger-node">
          <div className="trigger-icon">
            {trigger?.icon || '⚡'}
          </div>
          <div className="trigger-title">
            {trigger?.name || 'Manual Trigger'}
          </div>
        </div>
        
        <div className="trigger-label">
          When clicking 'Execute workflow'
        </div>

        {/* Output handle for connections */}
        <Handle
          type="source"
          position={Position.Right}
          id="trigger-output"
          className="trigger-node-handle"
        />
      </div>

      {/* Parameter Modal - consistent with other nodes */}
      {showParameterModal && (
        <ParameterModal
          nodeId={id}
          nodeType="trigger"
          nodeData={data}
          onClose={handleCloseModal}
          onSave={handleSaveParameters}
        />
      )}
    </>
  );
};