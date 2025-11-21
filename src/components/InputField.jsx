// src/components/InputField.jsx
import React from 'react';

const InputField = ({ type, placeholder, value, onChange, name }) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // Border එක ගොඩක් soft කළා (border-gray-200), background එක සුදුම කළා.
        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 ease-in-out placeholder-gray-400 shadow-sm hover:border-blue-300"
      />
    </div>
  );
};

export default InputField;