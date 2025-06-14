import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

// Import custom components and hooks
import { DropZone } from "./components/DropZone";
import { NodePickerModal } from "./components/NodePickerModal";
import { createIconNodeTypes } from "./components/IconNode";
import { CustomEdge, EndNodeButton } from "./components/CustomEdge";
import { useDragDrop } from "./hooks/useDragDrop";
import { useModalManagement } from "./hooks/useModalManagement";
import { useDropZone } from "./hooks/useDropZone";
import { nodeConfig } from "./config/nodeConfig";
import { getInitNodeData, calculateNodePosition } from "./utils/nodeDataHelpers";
import { isValidConnection } from "./utils/validationHelpers";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  triggerNode: state.triggerNode,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  addTriggerNode: state.addTriggerNode,
  deleteTriggerNode: state.deleteTriggerNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteNode: state.deleteNode,
  updateNodeData: state.updateNodeData,
  getEndNodes: state.getEndNodes,
  addNodeAfter: state.addNodeAfter,
  addNodeBetween: state.addNodeBetween,
});

// Plus Button Component
const PlusButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          Open nodes panel
          <span
            style={{
              backgroundColor: '#555',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            Tab
          </span>
        </div>
      )}
      
      {/* Plus Button */}
      <button
        onClick={onClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: '2px solid #ddd',
          backgroundColor: isHovered ? '#ff4444' : '#f5f5f5',
          color: isHovered ? 'white' : '#666',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          outline: 'none'
        }}
        onFocus={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onBlur={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
      >
        +
      </button>
    </div>
  );
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [pendingBetweenEdge, setPendingBetweenEdge] = useState(null);

  // Create icon-based node types and custom edge types
  const nodeTypes = useMemo(() => createIconNodeTypes(), []);
  const edgeTypes = useMemo(() => ({
    custom: (props) => (
      <CustomEdge 
        {...props} 
        onAddNodeBetween={handleAddNodeBetweenEdge}
      />
    ),
  }), []);

  // Store selectors
  const {
    nodes,
    edges,
    triggerNode,
    getNodeID,
    addNode,
    addTriggerNode,
    deleteTriggerNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    updateNodeData,
    getEndNodes,
    addNodeAfter,
    addNodeBetween,
  } = useStore(selector, shallow);

  // Custom hooks
  const {
    showNodePicker,
    modalOpen,
    searchTerm,
    setSearchTerm,
    openModal,
    closeModal
  } = useModalManagement();

  const {
    dragOverDropZone,
    onDropZoneDragOver,
    onDropZoneDragLeave
  } = useDropZone();

  // Initialize drag and drop functionality
  const { onDrop, onDragOver } = useDragDrop(reactFlowWrapper, reactFlowInstance, addNode, getNodeID);

  // Get end nodes for displaying add buttons
  const endNodes = useMemo(() => getEndNodes(), [nodes, edges, getEndNodes]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Check if we're not in an input field or textarea
        const activeElement = document.activeElement;
        const isInputField = activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' || 
          activeElement.contentEditable === 'true'
        );
        
        if (!isInputField) {
          event.preventDefault();
          openModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openModal]);

  // Helper functions
  const getInitNodeDataWrapper = useCallback((nodeID, type) => {
    return getInitNodeData(nodeID, type);
  }, []);

  const calculateNodePositionWrapper = useCallback(() => {
    return calculateNodePosition(nodes.length);
  }, [nodes.length]);

  // Handler for adding node between edges
  const handleAddNodeBetweenEdge = useCallback((edgeId, position) => {
    setPendingBetweenEdge({ edgeId, position });
    openModal();
  }, [openModal]);

  // Node handlers
  const handleAddNode = useCallback((type) => {
    if (pendingBetweenEdge) {
      const { edgeId, position } = pendingBetweenEdge;
      const nodeID = getNodeID(type);
      const newNodeData = {
        id: nodeID,
        type,
        data: getInitNodeDataWrapper(nodeID, type),
      };
      
      addNodeBetween(edgeId, newNodeData, position);
      setPendingBetweenEdge(null);
    } else {
      const position = calculateNodePositionWrapper();
      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeDataWrapper(nodeID, type),
      };
      addNode(newNode);
    }
    closeModal();
  }, [
    pendingBetweenEdge, 
    getNodeID, 
    getInitNodeDataWrapper, 
    addNodeBetween, 
    calculateNodePositionWrapper, 
    addNode, 
    closeModal
  ]);

  // Handle trigger selection
  const handleTriggerSelect = useCallback((trigger) => {
    const position = { x: 100, y: 100 }; // Center position for trigger
    addTriggerNode(trigger, position);
    closeModal();
  }, [addTriggerNode, closeModal]);

  // Handle adding node after end nodes
  const handleAddNodeToEnd = useCallback((endNode) => {
    const newNodeData = {
      type: 'default',
      data: getInitNodeDataWrapper(`default-${Date.now()}`, 'default'),
    };
    
    addNodeAfter(endNode, newNodeData);
  }, [addNodeAfter, getInitNodeDataWrapper]);

  // Drop zone handlers
  const onDropZoneDropWrapper = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
        
    const data = event.dataTransfer.getData("application/reactflow");
    if (data) {
      try {
        const { nodeType, triggerData } = JSON.parse(data);
        const trigger = nodeConfig.triggers?.find(t => t.type === nodeType);
        if (trigger) {
          handleTriggerSelect(trigger);
        }
      } catch (e) {
        console.error('Error parsing drop data:', e);
      }
    }
  }, [handleTriggerSelect]);

  // Enhanced close modal handler
  const handleCloseModal = useCallback(() => {
    setPendingBetweenEdge(null);
    closeModal();
  }, [closeModal]);

  const hasTrigger = triggerNode !== null;

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: "100vw", height: "70vh", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={proOptions}
          snapToGrid={true}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          isValidConnection={isValidConnection}
          fitView
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Plus Button - Always visible */}
        <PlusButton onClick={openModal} />

        {/* End Node Add Buttons */}
        {endNodes.map((node) => (
          <EndNodeButton
            key={`end-button-${node.id}`}
            node={node}
            onAddNode={handleAddNodeToEnd}
          />
        ))}

        {/* Drop Zone Component - only show when no trigger */}
        {!hasTrigger && (
          <DropZone
            hasTrigger={hasTrigger}
            dragOverDropZone={dragOverDropZone}
            onDrop={onDropZoneDropWrapper}
            onDragOver={onDropZoneDragOver}
            onDragLeave={onDropZoneDragLeave}
            onClick={openModal}
          />
        )}

        {/* Node Picker Modal Component */}
        <NodePickerModal
          showNodePicker={showNodePicker}
          modalOpen={modalOpen}
          showingTriggers={!hasTrigger} // Show triggers when no trigger exists
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          closeModal={handleCloseModal}
          onTriggerSelect={handleTriggerSelect}
          onNodeSelect={handleAddNode}
          hasTrigger={hasTrigger}
        />
      </div>

      {/* Add CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};