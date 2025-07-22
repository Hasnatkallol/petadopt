import React from "react";

const Toggle = ({ checked, onChange, size = "medium" }) => {
  const sizes = {
    small: {
      width: 40,
      height: 24,
      ballSize: 16,
      translateX: 16,
    },
    medium: {
      width: 56,
      height: 32,
      ballSize: 24,
      translateX: 24,
    },
  };

  const { width, height, ballSize, translateX } = sizes[size];

  return (
    <label
      className="relative inline-flex items-center cursor-pointer"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: "0 4px", // Added small margin to prevent crowding
      }}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300`}
        style={{
          backgroundColor: checked
            ? "rgba(255,255,255,0.5)"
            : "rgba(0,0,0,0.5)",
        }}
      />
      <div
        className={`absolute rounded-full shadow-md transition-transform duration-300 bg-white`}
        style={{
          width: `${ballSize}px`,
          height: `${ballSize}px`,
          left: "4px",
          top: "50%",
          transform: checked
            ? `translateX(${translateX}px) translateY(-50%)`
            : "translateX(0) translateY(-50%)",
        }}
      />
    </label>
  );
};

export default Toggle;
