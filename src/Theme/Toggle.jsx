import React from "react";

const Toggle = ({ checked, onChange }) => {
  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-full h-full rounded-full transition-colors duration-300 ${
          checked ? "bg-red-500" : "bg-blue-600"
        }`}
      ></div>
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-6" : ""
        }`}
      ></div>
    </label>
  );
};

export default Toggle;
