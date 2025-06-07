// hooks/useTriggerManagement.js
// Trigger management custom hook
// --------------------------------------------------

import { useState, useCallback } from "react";

export const useTriggerManagement = () => {
  const [showingTriggers, setShowingTriggers] = useState(true);
  const [droppedTrigger, setDroppedTrigger] = useState(null);

  const handleTriggerSelect = useCallback((trigger, getNodeID, calculateNodePosition, getInitNodeData, addNode, closeModal) => {
    if (!droppedTrigger) {
      setDroppedTrigger(trigger);
      setShowingTriggers(false);
      closeModal();
      
      const nodeID = getNodeID(trigger.type);
      const newNode = {
        id: nodeID,
        type: trigger.type,
        position: calculateNodePosition(),
        data: getInitNodeData(nodeID, trigger.type),
      };
      addNode(newNode);
    }
  }, [droppedTrigger]);

  const handleDeleteTrigger = useCallback(() => {
    setDroppedTrigger(null);
    setShowingTriggers(true);
  }, []);

  const handleToggleActive = useCallback(() => {
    console.log("Toggle active");
  }, []);

  const handlePlayPause = useCallback(() => {
    console.log("Play/pause");
  }, []);

  const handleAddNodeFromTrigger = useCallback((openModal) => {
    setShowingTriggers(false);
    openModal();
  }, []);

  const showTriggersAgain = useCallback((openModal) => {
    setShowingTriggers(true);
    openModal();
  }, []);

  return {
    showingTriggers,
    droppedTrigger,
    setShowingTriggers,
    setDroppedTrigger,
    handleTriggerSelect,
    handleDeleteTrigger,
    handleToggleActive,
    handlePlayPause,
    handleAddNodeFromTrigger,
    showTriggersAgain
  };
};