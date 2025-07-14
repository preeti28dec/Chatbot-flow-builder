import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'react-flow-renderer';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import TextNode from './components/TextNode'; // Custom node for Text Message
import { initialNodes, initialEdges } from './initial-elements'; // Initial data
import './App.css';

const nodeTypes = {
  textNode: TextNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Handles connection between nodes
  const onConnect = useCallback(
    (params) => {
      // Check if source handle already has an edge
      const existingEdge = edges.find(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
      if (existingEdge) {
        setErrorMessage('Cannot have more than one edge originating from a source handle.');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  // Handles drag over event for dropping nodes
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handles dropping a node from the sidebar
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position: position || { x: 0, y: 0 },
        data: { label: 'textNode', message: 'New Message' }, // Default message
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handles node click to select it and open settings panel
  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);
      setShowSettingsPanel(true);
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, selected: true }
            : { ...n, selected: false }
        )
      );
    },
    [setNodes]
  );

  // Handles canvas click to deselect node and close settings panel
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowSettingsPanel(false);
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, [setNodes]);

  // Handles updating the message of the selected node
  const onMessageChange = useCallback(
    (newMessage) => {
      if (selectedNode) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === selectedNode.id
              ? { ...node, data: { ...node.data, message: newMessage } }
              : node
          )
        );
        setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, message: newMessage } } : null));
      }
    },
    [selectedNode, setNodes]
  );

  // Validation logic for saving the flow
  const handleSave = useCallback(() => {
    setErrorMessage(null); // Clear previous errors

    // Rule: More than one Nodes and more than one Node has empty target handles
    if (nodes.length > 1) {
      const nodesWithEmptyTargetHandles = nodes.filter((node) => {
        // A node has an "empty target handle" if no edge connects to its target.
        // In React Flow, "target handle" typically refers to the left side of the node.
        // We are checking if a node is *not* a target for any edge.
        return !edges.some((edge) => edge.target === node.id);
      });

      // Exclude the starting node if it's not expected to have incoming edges
      // For a chatbot, usually the first message node wouldn't have an incoming edge.
      // This part might need adjustment based on specific flow requirements.
      // For simplicity, let's just count nodes without incoming edges.
      if (nodesWithEmptyTargetHandles.length > 1) {
        setErrorMessage('Cannot save Flow: More than one node has an empty target handle.');
        return;
      }
    }

    // You can add more validation rules here if needed.
    console.log('Flow saved!', { nodes, edges });
    alert('Flow saved successfully!'); // For demonstration
  }, [nodes, edges]);

  return (
    <div className="dnd-flow flex h-screen w-screen bg-gray-100">
      <ReactFlowProvider>
        <div className="reactflow-wrapper flex-grow h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-white"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <div className="sidebar w-80 bg-gray-200 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Save Changes
              </button>
            </div>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            {showSettingsPanel && selectedNode ? (
              <SettingsPanel node={selectedNode} onMessageChange={onMessageChange} />
            ) : (
              <Sidebar />
            )}
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default App;