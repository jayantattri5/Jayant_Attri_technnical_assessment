// components/CustomEdge.js
import React, { useState } from 'react';
import { 
  BaseEdge, 
  EdgeLabelRenderer, 
  getBezierPath,
  useReactFlow 
} from 'reactflow';

// Simple icon components (since lucide-react might not be available)
const PlusIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const XIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  onAddNodeBetween // Add this prop to handle modal opening
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDeleteEdge = (e) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const handleAddNodeBetween = (e) => {
    e.stopPropagation();
    // Call the parent function to handle modal opening and node insertion
    if (onAddNodeBetween) {
      onAddNodeBetween(id, { x: labelX, y: labelY });
    }
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: isHovered ? 6 : 5,
        }}
      />
      {/* Invisible wider path for easier hover detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={30}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <EdgeLabelRenderer>
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              display: 'flex',
              gap: '4px',
              zIndex: 1000,
            }}
            className="nodrag nopan"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              onClick={handleAddNodeBetween}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: '2px solid #10b981',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: '#10b981',
              }}
              title="Add node between"
            >
              <PlusIcon />
            </button>
            <button
              onClick={handleDeleteEdge}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: '2px solid #ef4444',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: '#ef4444',
              }}
              title="Delete connection"
            >
              <XIcon />
            </button>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

// Simple plus icon component
const PlusIconSimple = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// components/EndNodeButton.js
export const EndNodeButton = ({ node, onAddNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!node) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: node.position.x + 200, // Adjust based on your node width
        top: node.position.y + 50,   // Adjust based on your node height
        zIndex: 1000,
        pointerEvents: 'all',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="nodrag nopan"
    >
      {isHovered && (
        <button
          onClick={() => onAddNode(node)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid #10b981',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#10b981',
          }}
          title="Add node after"
        >
          <PlusIconSimple />
        </button>
      )}
    </div>
  );
};