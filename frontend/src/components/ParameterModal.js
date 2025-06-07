// components/ParameterModal.js
// Parameter configuration modal component - Full screen version
// --------------------------------------------------

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NodeIcon } from "./NodeIcon";
import { getParameterFields, getNodeTitle } from "../utils/nodeParameterConfig";

export const ParameterModal = ({ nodeId, nodeType, nodeData, onClose, onSave }) => {
  const [parameters, setParameters] = useState(nodeData || {});
  const [activeTab, setActiveTab] = useState('parameters');

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(nodeId, parameters);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="parameter-modal-backdrop" onClick={handleBackdropClick}>
      <div className="parameter-modal-fullscreen">
        {/* Header */}
        <div className="parameter-modal-header">
          <div className="parameter-modal-header-left">
            <button className="back-to-canvas-btn" onClick={onClose}>
              ← Back to canvas
            </button>
          </div>
          
          <div className="parameter-modal-header-center">
            <div className="parameter-modal-icon">
              <NodeIcon type={nodeType} size={24} />
            </div>
            <h1 className="parameter-modal-title">{getNodeTitle(nodeType)}</h1>
          </div>

          <div className="parameter-modal-header-right">
            <button className="parameter-modal-execute-btn" onClick={handleSave}>
              🔺 Execute step
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="parameter-modal-body">
          {/* Left Sidebar - Input/Trigger Info */}
          <div className="parameter-modal-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">INPUT</h3>
              <div className="input-trigger-info">
                <div className="trigger-item">
                  <span className="trigger-icon">⚡</span>
                  <span>When clicking 'Execute workflow'</span>
                  <span className="item-count">1 item</span>
                </div>
                <div className="trigger-details">
                  No fields - item(s) exist, but they're empty
                </div>
              </div>
              
              <div className="variables-section">
                <button className="variables-toggle">
                  ▶ Variables and context
                </button>
              </div>
            </div>
          </div>

          {/* Center Content - Parameters */}
          <div className="parameter-modal-content">
            {/* Tabs */}
            <div className="parameter-modal-tabs">
              <button 
                className={`parameter-tab ${activeTab === 'parameters' ? 'active' : ''}`}
                onClick={() => setActiveTab('parameters')}
              >
                Parameters
              </button>
              <button 
                className={`parameter-tab ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
              <button 
                className={`parameter-tab ${activeTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('docs')}
              >
                Docs ↗
              </button>
            </div>

            {/* Tab Content */}
            <div className="parameter-tab-content">
              {activeTab === 'parameters' && (
                <div className="parameter-form">
                  {/* API Credits Notice */}
                  <div className="api-credits-notice">
                    <span className="info-icon">ℹ</span>
                    <span>Get 100 free OpenAI API credits</span>
                    <button className="claim-credits-btn">Claim credits</button>
                  </div>

                  {/* Parameter Fields */}
                  {getParameterFields(nodeType).map(field => (
                    <div key={field.key} className="parameter-form-field">
                      <label className="parameter-form-label">
                        {field.label}
                        {field.required && <span className="required-asterisk">*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <div className="parameter-select-wrapper">
                          <select
                            className="parameter-form-select"
                            value={parameters[field.key] || ''}
                            onChange={(e) => handleParameterChange(field.key, e.target.value)}
                          >
                            <option value="">Choose...</option>
                            {field.options?.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          {field.required && !parameters[field.key] && (
                            <div className="parameter-error-icon">⚠</div>
                          )}
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          className="parameter-form-textarea"
                          value={parameters[field.key] || ''}
                          onChange={(e) => handleParameterChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                        />
                      ) : field.type === 'number' ? (
                        <input
                          type="number"
                          className="parameter-form-input"
                          value={parameters[field.key] || ''}
                          onChange={(e) => handleParameterChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                        />
                      ) : field.type === 'checkbox' ? (
                        <label className="parameter-checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={parameters[field.key] || false}
                            onChange={(e) => handleParameterChange(field.key, e.target.checked)}
                          />
                          <span className="parameter-checkbox-checkmark"></span>
                          <span className="checkbox-label">{field.placeholder}</span>
                        </label>
                      ) : (
                        <input
                          type="text"
                          className="parameter-form-input"
                          value={parameters[field.key] || ''}
                          onChange={(e) => handleParameterChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="settings-content">
                  <p>Settings configuration will go here...</p>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="docs-content">
                  <p>Documentation will be loaded here...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Output */}
          <div className="parameter-modal-output">
            <div className="output-section">
              <h3 className="output-title">OUTPUT</h3>
              <div className="output-content">
                <div className="output-placeholder">
                  <div className="loading-spinner">⚙</div>
                  <p>Execute this node to view data</p>
                  <button className="set-mock-data-btn">or set mock data</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using createPortal to escape ReactFlow container
  return createPortal(modalContent, document.body);
};