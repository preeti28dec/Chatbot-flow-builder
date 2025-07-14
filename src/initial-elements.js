// src/initial-elements.js

export const initialNodes = [
  {
    id: '1',
    type: 'textNode',
    data: { label: 'textNode', message: 'test message 1' },
    position: { x: 250, y: 100 },
  },
  {
    id: '2',
    type: 'textNode',
    data: { label: 'textNode', message: 'test message 2' },
    position: { x: 500, y: 100 },
  },
  {
    id: '3',
    type: 'textNode',
    data: { label: 'textNode', message: 'textNode' },
    position: { x: 500, y: 300 },
  },
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', sourceHandle: 'b', targetHandle: 'a', animated: true },
];