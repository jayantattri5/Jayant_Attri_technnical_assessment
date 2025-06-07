// store.js (Updated with trigger node support)
import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {}, // Initialize nodeIDs properly
    triggerNode: null, // Track the trigger node separately
    
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    
    // Add trigger node functionality
    addTriggerNode: (triggerData, position) => {
        const state = get();
        // Remove existing trigger node if any
        const nodesWithoutTrigger = state.nodes.filter(node => node.type !== 'trigger');
        
        const triggerNodeId = 'trigger-node';
        const newTriggerNode = {
            id: triggerNodeId,
            type: 'trigger',
            position: position || { x: 100, y: 100 },
            data: {
                trigger: triggerData,
            },
            draggable: true,
            selectable: true,
        };

        set({
            nodes: [...nodesWithoutTrigger, newTriggerNode],
            triggerNode: newTriggerNode,
        });
    },

    deleteTriggerNode: () => {
        const state = get();
        set({
            nodes: state.nodes.filter(node => node.type !== 'trigger'),
            edges: state.edges.filter(edge => edge.source !== 'trigger-node'),
            triggerNode: null,
        });
    },

    toggleTriggerActive: () => {
        const state = get();
        const updatedNodes = state.nodes.map(node => {
            if (node.type === 'trigger') {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        trigger: {
                            ...node.data.trigger,
                            active: !node.data.trigger.active
                        }
                    }
                };
            }
            return node;
        });
        
        set({ nodes: updatedNodes });
    },

    playPauseTrigger: () => {
        // Implement play/pause logic
        console.log('Play/Pause trigger');
        // You can add more logic here as needed
    },
    
    deleteNode: (nodeId) => {
        const state = get();
        // If deleting a trigger node, use special trigger deletion
        if (nodeId === 'trigger-node') {
            get().deleteTriggerNode();
            return;
        }
        
        set({
            nodes: state.nodes.filter(node => node.id !== nodeId),
            edges: state.edges.filter(edge => 
                edge.source !== nodeId && edge.target !== nodeId
            )
        });
    },
    
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    
    onConnect: (connection) => {
        set({
            edges: addEdge({
                ...connection, 
                type: 'custom', // Use custom edge type
                animated: true, 
                markerEnd: {
                    type: MarkerType.Arrow, 
                    height: '20px', 
                    width: '20px'
                }
            }, get().edges),
        });
    },
    
    updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, [fieldName]: fieldValue };
                }
                return node;
            }),
        });
    },
    
    updateNodeData: (nodeId, newData) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } };
                }
                return node;
            }),
        });
    },
    
    // Helper function to find end nodes (nodes with no outgoing edges)
    getEndNodes: () => {
        const { nodes, edges } = get();
        return nodes.filter(node => 
            !edges.some(edge => edge.source === node.id)
        );
    },
    
    // Helper function to add node after a specific node
    addNodeAfter: (sourceNode, newNodeData) => {
        const { nodes, edges, getNodeID } = get();
        
        // Generate new node ID and position
        const newNodeId = getNodeID(newNodeData.type || 'default');
        const newPosition = {
            x: sourceNode.position.x + 250, // Adjust spacing as needed
            y: sourceNode.position.y,
        };
        
        const newNode = {
            id: newNodeId,
            ...newNodeData,
            position: newPosition,
        };
        
        // Add the new node
        set({
            nodes: [...nodes, newNode]
        });
        
        // Optionally auto-connect to the source node
        const newEdge = {
            id: `${sourceNode.id}-${newNodeId}`,
            source: sourceNode.id,
            target: newNodeId,
            type: 'custom',
            animated: true,
            markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' }
        };
        
        set({
            edges: [...edges, newEdge]
        });
        
        return newNodeId;
    },
    
    // Helper function to add node between two existing nodes
    addNodeBetween: (edgeId, newNodeData, position) => {
        const { nodes, edges } = get();
        
        // Find the edge to replace
        const targetEdge = edges.find(edge => edge.id === edgeId);
        if (!targetEdge) return;
        
        // Find source and target nodes
        const sourceNode = nodes.find(node => node.id === targetEdge.source);
        const targetNode = nodes.find(node => node.id === targetEdge.target);
        if (!sourceNode || !targetNode) return;
        
        // Calculate position for new node (midpoint between source and target)
        const newPosition = {
            x: (sourceNode.position.x + targetNode.position.x) / 2,
            y: (sourceNode.position.y + targetNode.position.y) / 2,
        };
        
        // Create the new node
        const newNode = {
            ...newNodeData,
            position: newPosition,
        };
        
        // Add the new node
        set({
            nodes: [...nodes, newNode]
        });
        
        // Remove the original edge and create two new edges
        const filteredEdges = edges.filter(edge => edge.id !== edgeId);
        
        const newEdges = [
            {
                id: `${targetEdge.source}-${newNode.id}`,
                source: targetEdge.source,
                target: newNode.id,
                type: 'custom',
                animated: true,
                markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' }
            },
            {
                id: `${newNode.id}-${targetEdge.target}`,
                source: newNode.id,
                target: targetEdge.target,
                type: 'custom',
                animated: true,
                markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' }
            }
        ];
        
        set({
            edges: [...filteredEdges, ...newEdges]
        });
        
        return newNode.id;
    },
}));