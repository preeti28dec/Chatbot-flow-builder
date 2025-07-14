import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="border-t border-gray-300 pt-4">
      <div className="description text-sm text-gray-700 mb-4">
        Drag these nodes to the pane on the left.
      </div>
      <div
        className="dndnode bg-white border border-blue-500 rounded-md p-3 mb-3 cursor-grab flex items-center justify-center text-blue-700"
        onDragStart={(event) => onDragStart(event, 'textNode')}
        draggable
      >
        <span className="mr-2">&#9776;</span> Message
      </div>
    </aside>
  );
};

export default Sidebar;