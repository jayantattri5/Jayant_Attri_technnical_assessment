// hooks/useDropZone.js
// Drop zone management custom hook
// --------------------------------------------------

import { useState, useCallback } from "react";

export const useDropZone = () => {
  const [dragOverDropZone, setDragOverDropZone] = useState(false);

  const onDropZoneDrop = useCallback((event, nodeConfig, closeModal, getNodeID, calculateNodePosition, getInitNodeData, addNode, setDroppedTrigger, setShowingTriggers) => {
    event.preventDefault();
    event.stopPropagation();
    
    const data = event.dataTransfer.getData("application/reactflow");
    if (data) {
      try {
        const { nodeType, triggerData } = JSON.parse(data);
        const trigger = nodeConfig.triggers?.find(t => t.type === nodeType);
        if (trigger) {
          setDroppedTrigger(trigger);
          setShowingTriggers(false);
          closeModal();
          
          const nodeID = getNodeID(nodeType);
          const newNode = {
            id: nodeID,
            type: nodeType,
            position: calculateNodePosition(),
            data: getInitNodeData(nodeID, nodeType),
          };
          addNode(newNode);
        }
      } catch (e) {
        console.error('Error parsing drop data:', e);
      }
    }
    setDragOverDropZone(false);
  }, []);

  const onDropZoneDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverDropZone(true);
  }, []);

  const onDropZoneDragLeave = useCallback(() => {
    setDragOverDropZone(false);
  }, []);

  return {
    dragOverDropZone,
    onDropZoneDrop,
    onDropZoneDragOver,
    onDropZoneDragLeave
  };
};