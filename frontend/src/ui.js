// Enhanced ui.js with corrected positioning and functionality
// --------------------------------------------------
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap, useViewport } from "reactflow";
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
import { getParameterFields } from "./utils/nodeParameterConfig";

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

// Node Status Indicator Component  
const NodeStatusIndicator = ({ node, onClick, reactFlowInstance, viewport }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Check if node configuration is complete using actual parameter config
  const { isConfigured, issues } = useMemo(() => {
    const parameterFields = getParameterFields(node.type);
    const requiredFields = parameterFields.filter(field => field.required);
    const nodeIssues = [];
    
    // Check each required field
    requiredFields.forEach(field => {
      const value = node.data[field.key];
      if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        nodeIssues.push(`Parameter "${field.label}" is required.`);
      }
    });

    // Special validation for credential fields
    const credentialField = parameterFields.find(field => field.key === 'credential');
    if (credentialField && node.data.credential === 'Select Credential') {
      nodeIssues.push('Credentials are not set.');
    }

    return {
      isConfigured: nodeIssues.length === 0,
      issues: nodeIssues
    };
  }, [node]);

  // Calculate position using reactFlowInstance project method
  const position = useMemo(() => {
    if (!reactFlowInstance || !viewport) return { x: 0, y: 0 };
    
    const nodeWidth = 150; // Approximate node width
    const projectedPosition = reactFlowInstance.project({
      x: node.position.x + nodeWidth - 10,
      y: node.position.y - 10
    });
    return projectedPosition;
  }, [node.position, reactFlowInstance, viewport]);

  const handleMouseEnter = () => {
    if (!isConfigured && issues.length > 0) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000,
        pointerEvents: 'auto',
        transform: 'translate(-50%, -50%)', // Center the indicator
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: isConfigured ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {isConfigured ? '✓' : '⚠'}
      </div>
      
      {showTooltip && !isConfigured && issues.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '25px',
            left: '-100px',
            backgroundColor: '#374151',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: '1.4',
            minWidth: '200px',
            maxWidth: '300px',
            zIndex: 1001,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Issues:</div>
          {issues.map((issue, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              - {issue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Node Plus Button Component
const NodePlusButton = ({ node, onClick, reactFlowInstance, viewport }) => {
  
  // Calculate position using reactFlowInstance project method
  const position = useMemo(() => {
    if (!reactFlowInstance || !viewport) return { x: 0, y: 0 };
    
    const nodeWidth = 150; // Approximate node width
    const nodeHeight = 80; // Approximate node height
    
    const projectedPosition = reactFlowInstance.project({
      x: node.position.x + nodeWidth / 2,
      y: node.position.y + nodeHeight + 20
    });
    return projectedPosition;
  }, [node.position, reactFlowInstance, viewport]);

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000,
        pointerEvents: 'auto',
        transform: 'translate(-50%, -50%)', // Center the button
      }}
    >
      <button
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '16px',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#2563eb';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#3b82f6';
          e.target.style.transform = 'scale(1)';
        }}
        onClick={onClick}
      >
        +
      </button>
    </div>
  );
};

// Overlay component to contain all floating elements
const NodeOverlay = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {children}
    </div>
  );
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [pendingBetweenEdge, setPendingBetweenEdge] = useState(null);
  const [pendingNodeAfter, setPendingNodeAfter] = useState(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

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

  // Handle viewport changes
  const onViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
  }, []);

  // Get end nodes for displaying add buttons
  const endNodes = useMemo(() => getEndNodes(), [nodes, edges, getEndNodes]);

  // Helper functions
  const getInitNodeDataWrapper = useCallback((nodeID, type) => {
    return getInitNodeData(nodeID, type);
  }, []);

  // Enhanced position calculation for horizontal layout
  const calculateNodePositionWrapper = useCallback((sourceNode) => {
    if (sourceNode) {
      // For horizontal layout, position to the right of source node
      return {
        x: sourceNode.position.x + 200, // Position to the right with spacing
        y: sourceNode.position.y // Same Y level for horizontal alignment
      };
    }
    return calculateNodePosition(nodes.length);
  }, [nodes.length]);

  // Function to shift nodes horizontally when inserting between nodes
  const shiftNodesAfterInsertion = useCallback((insertX, newNodeId) => {
    const nodesToShift = nodes.filter(node => 
      node.position.x >= insertX && node.id !== newNodeId
    );
    
    if (nodesToShift.length > 0) {
      const shiftAmount = 200; // Amount to shift nodes to the right
      const updatedNodes = nodes.map(node => {
        if (nodesToShift.some(n => n.id === node.id)) {
          return {
            ...node,
            position: {
              ...node.position,
              x: node.position.x + shiftAmount
            }
          };
        }
        return node;
      });
      
      // Update nodes in store
      onNodesChange(updatedNodes.map(node => ({
        type: 'position',
        id: node.id,
        position: node.position
      })));
    }
  }, [nodes, onNodesChange]);

  // Handler for adding node between edges
  const handleAddNodeBetweenEdge = useCallback((edgeId, position) => {
    setPendingBetweenEdge({ edgeId, position });
    openModal();
  }, [openModal]);

  // Handler for adding node after a specific node
  const handleAddNodeAfter = useCallback((nodeId) => {
    setPendingNodeAfter(nodeId);
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
    } else if (pendingNodeAfter) {
      const sourceNode = nodes.find(n => n.id === pendingNodeAfter);
      if (sourceNode) {
        const nodeID = getNodeID(type);
        const newPosition = calculateNodePositionWrapper(sourceNode);
        
        // Shift existing nodes to make room
        shiftNodesAfterInsertion(newPosition.x, nodeID);
        
        const newNodeData = {
          id: nodeID,
          type,
          data: getInitNodeDataWrapper(nodeID, type),
        };
        
        // Create the new node
        const newNode = {
          id: nodeID,
          type,
          position: newPosition,
          data: newNodeData.data,
        };
        
        // Add the node
        addNode(newNode);
        
        // Create connection automatically
        const newEdge = {
          id: `${sourceNode.id}-${nodeID}`,
          source: sourceNode.id,
          target: nodeID,
          type: 'custom',
        };
        
        // Add the edge through the store's onConnect method
        onConnect(newEdge);
      }
      setPendingNodeAfter(null);
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
    pendingNodeAfter,
    nodes,
    getNodeID, 
    getInitNodeDataWrapper, 
    addNodeBetween,
    calculateNodePositionWrapper, 
    addNode,
    onConnect,
    closeModal,
    shiftNodesAfterInsertion
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

  // Handle node configuration click
  const handleNodeConfigClick = useCallback((node) => {
    // Add your logic here to open node configuration
    console.log('Configure node:', node);
  }, []);

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
    setPendingNodeAfter(null);
    closeModal();
  }, [closeModal]);

  // Enhanced nodes with better border styling
  const enhancedNodes = useMemo(() => {
    return nodes.map(node => {
      const parameterFields = getParameterFields(node.type);
      const requiredFields = parameterFields.filter(field => field.required);
      
      // Check if all required fields are properly configured
      const isConfigured = requiredFields.every(field => {
        const value = node.data[field.key];
        if (field.key === 'credential' && value === 'Select Credential') {
          return false;
        }
        return value && value !== '' && (!Array.isArray(value) || value.length > 0);
      });
      
      return {
        ...node,
        style: {
          ...node.style,
          border: `2px solid ${isConfigured ? '#10b981' : '#ef4444'}`,
          borderRadius: '8px',
          padding: '4px', // Add padding to ensure border fits properly
          minWidth: '140px', // Ensure minimum width
          minHeight: '70px', // Ensure minimum height
          boxSizing: 'border-box', // Include border in size calculations
        }
      };
    });
  }, [nodes]);

  const hasTrigger = triggerNode !== null;

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: "100vw", height: "70vh", position: "relative" }}>
        <ReactFlow
          nodes={enhancedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          onViewportChange={onViewportChange}
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

        {/* Node Overlay for floating elements */}
        <NodeOverlay>
          {/* Node Status Indicators */}
          {enhancedNodes.map((node) => (
            <NodeStatusIndicator
              key={`status-${node.id}`}
              node={node}
              reactFlowInstance={reactFlowInstance}
              viewport={viewport}
              onClick={() => handleNodeConfigClick(node)}
            />
          ))}

          {/* Node Plus Buttons */}
          {enhancedNodes.map((node) => (
            <NodePlusButton
              key={`plus-${node.id}`}
              node={node}
              reactFlowInstance={reactFlowInstance}
              viewport={viewport}
              onClick={() => handleAddNodeAfter(node.id)}
            />
          ))}
        </NodeOverlay>

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
    </>
  );
};