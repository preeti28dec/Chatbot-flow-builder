// src/components/SettingsPanel.js
import React, { useEffect, useState } from 'react';

const SettingsPanel = ({ node, onMessageChange }) => {
  const [message, setMessage] = useState(node.data?.message || '');

  useEffect(() => {
    // Update local state when selected node changes
    setMessage(node.data?.message || '');
  }, [node]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setMessage(newValue);
    onMessageChange(newValue);
  };

  return (
    <div className="settings-panel border-t border-gray-300 pt-4">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <div className="mb-4">
        <label htmlFor="message-text" className="block text-sm font-medium text-gray-700 mb-1">
          Message Text
        </label>
        <textarea
          id="message-text"
          name="message-text"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          value={message}
          onChange={handleChange}
        ></textarea>
      </div>
      {/* You can add more settings here for different node types */}
    </div>
  );
};

export default SettingsPanel;