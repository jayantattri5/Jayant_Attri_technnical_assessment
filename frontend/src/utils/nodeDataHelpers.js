// utils/nodeDataHelpers.js
// Node data initialization utilities
// --------------------------------------------------

export const getInitNodeData = (nodeID, type) => {
  let nodeData = { 
    id: nodeID, 
    nodeType: `${type}`,
    // Add default parameters based on node type
    ...(type === 'llm' && { model: 'GPT-4', temperature: 0.7 }),
    ...(type === 'conditionNode' && { operator: 'equals' }),
    ...(type === 'text' && { format: 'plain' }),
  };
  return nodeData;
};

export const calculateNodePosition = (nodesLength) => {
  const baseX = 300;
  const baseY = 200;
  const offset = nodesLength * 50;
  return { x: baseX + offset, y: baseY + (offset % 200) };
};