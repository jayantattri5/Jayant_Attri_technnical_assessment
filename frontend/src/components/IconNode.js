// components/IconNode.js
// Icon-based node component and node type factory
// --------------------------------------------------

import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";
import { NodeIcon } from "./NodeIcon";
import { ParameterModal } from "./ParameterModal";
import { getNodeTypeLabel, getNodeColor } from "../utils/nodeHelpers";
import { TriggerNode } from './TriggerNode';

// Icon-based Node Component
const IconNode = ({ data, id, type, selected }) => {
  const [showControls, setShowControls] = useState(false);
  const [showParameterModal, setShowParameterModal] = useState(false);
  const deleteNode = useStore(state => state.deleteNode);
  const updateNodeData = useStore(state => state.updateNodeData);

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
    if (deleteNode) {
      deleteNode(id);
    }
  }, [id, deleteNode]);

  return (
    <>
      <div 
        className={`icon-node ${type}-icon-node ${selected ? 'selected' : ''}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onDoubleClick={handleDoubleClick}
        style={{ '--node-color': getNodeColor(type) }}
      >
        {/* Node Controls */}
        {showControls && (
          <div className="icon-node-controls">
            <button className="icon-control-btn delete-btn" onClick={handleDelete}>
              ×
            </button>
            <button className="icon-control-btn toggle-btn">
              ⚡
            </button>
            <button className="icon-control-btn play-btn">
              ▶
            </button>
          </div>
        )}

        {/* Main Icon */}
        <div className="icon-node-icon">
          <NodeIcon type={type} size={48} />
        </div>

        {/* Node Label */}
        <div className="icon-node-label">
          {getNodeTypeLabel(type)}
        </div>

        {/* Connection Handles */}
        <Handle type="target" position={Position.Left} className="icon-node-handle" />
        <Handle type="source" position={Position.Right} className="icon-node-handle" />
      </div>

      {/* Parameter Modal */}
      {showParameterModal && (
        <ParameterModal
          nodeId={id}
          nodeType={type}
          nodeData={data}
          onClose={handleCloseModal}
          onSave={handleSaveParameters}
        />
      )}
    </>
  );
};

// Create node types with icon wrapper
export const createIconNodeTypes = () => {
  const nodeTypes = {};
  const originalTypes = [
    'customInput', 'llm', 'customOutput', 'text', 'mathNode', 
    'conditionNode', 'timerNode', 'logNode', 'dropdownNode'
  ];
  
  originalTypes.forEach(type => {
    nodeTypes[type] = (props) => <IconNode {...props} type={type} />;
  });

   // Add the trigger node type
  nodeTypes.trigger = TriggerNode;
  
  return nodeTypes;
};