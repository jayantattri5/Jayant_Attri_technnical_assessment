// components/NodePickerModal.js
// Modal for selecting nodes and triggers
// --------------------------------------------------

import React from 'react';
import { nodeConfig } from '../config/nodeConfig';

export const NodePickerModal = ({
  showNodePicker,
  modalOpen,
  showingTriggers,
  searchTerm,
  setSearchTerm,
  setShowingTriggers,
  closeModal,
  onTriggerSelect,
  onNodeSelect,
  onAddTrigger,
  hasTrigger
}) => {
  if (!showNodePicker) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const onDragStart = (event, triggerType, triggerData) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType: triggerType, triggerData })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // Filter nodes and triggers based on search term
  const filteredTriggers = nodeConfig.triggers.filter((node) =>
    node.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNodes = nodeConfig.nodes.filter((node) =>
    node.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNodes = hasTrigger && !showingTriggers;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container ${modalOpen ? "open" : ""}`}>
        <div className="modal-header">
          <button className="back-btn" onClick={() => setShowingTriggers(!showingTriggers)}>
            ← Back
          </button>
          <h2 className="modal-title">
            {showingTriggers ? "What triggers this workflow?" : "Choose a node"}
          </h2>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Triggers Section */}
        {(showingTriggers || !hasTrigger) && filteredTriggers.length > 0 && (
          <div className="trigger-section">
            <div className="trigger-list">
              {filteredTriggers.map((trigger) => (
                <div
                  key={trigger.type}
                  className="trigger-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, trigger.type, trigger)}
                  onClick={() => onTriggerSelect(trigger)}
                >
                  <div className="trigger-item-icon">
                    {trigger.icon}
                  </div>
                  <div className="trigger-item-content">
                    <div className="trigger-item-title">{trigger.title}</div>
                    <div className="trigger-item-description">{trigger.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nodes Section */}
        {showNodes && filteredNodes.length > 0 && (
          <>
            <div className="trigger-section">
              <h3 className="trigger-section-title">Nodes</h3>
              <div className="node-grid">
                {filteredNodes.map((node) => (
                  <button
                    key={node.type}
                    onClick={() => onNodeSelect(node.type)}
                    className="node-button"
                  >
                    <div className="node-button-icon">{node.icon}</div>
                    <div className="node-button-title">{node.title}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <button className="add-trigger-btn" onClick={onAddTrigger}>
              + Add another Trigger to this workflow
            </button>
          </>
        )}

        {/* No results */}
        {((showingTriggers && filteredTriggers.length === 0) || 
          (showNodes && filteredNodes.length === 0)) && 
          searchTerm && (
          <div className="no-results">
            No {showingTriggers ? 'triggers' : 'nodes'} found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};