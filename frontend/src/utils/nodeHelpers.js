// utils/nodeHelpers.js
// Node helper utilities
// --------------------------------------------------

export const getNodeTypeLabel = (type) => {
  const labels = {
    customInput: 'Input',
    llm: 'LLM',
    customOutput: 'Output',
    text: 'Text',
    mathNode: 'Math',
    conditionNode: 'Condition',
    timerNode: 'Timer',
    logNode: 'Log',
    dropdownNode: 'Dropdown'
  };
  return labels[type] || 'Node';
};

export const getNodeColor = (type) => {
  const colors = {
    customInput: '#10b981',
    llm: '#8b5cf6',
    customOutput: '#ef4444',
    text: '#06b6d4',
    mathNode: '#f59e0b',
    conditionNode: '#f59e0b',
    timerNode: '#6b7280',
    logNode: '#64748b',
    dropdownNode: '#84cc16'
  };
  return colors[type] || '#6b7280';
};