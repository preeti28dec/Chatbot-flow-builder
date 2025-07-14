import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const TextNode = ({ data }) => {
  return (
    <div className="text-node bg-white border border-gray-300 rounded-md shadow-md p-4 min-w-[150px]">
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="!bg-blue-500 !w-3 !h-3"
      />
      <div className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        &#9776; Send Message
      </div>
      <div className="text-sm text-gray-800 break-words">
        {data.message}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="!bg-blue-500 !w-3 !h-3"
        isConnectable={true} // Allow connecting from this handle
      />
    </div>
  );
};

export default memo(TextNode);