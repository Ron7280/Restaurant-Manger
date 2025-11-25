import React from "react";

const AnimatedButton = ({
  func,
  color,
  icon: Icon,
  size,
  text,
  w1,
  w2,
  pad,
}) => {
  return (
    <button
      onClick={func}
      className={`relative flex items-center justify-center w-[${w1}] group
              rounded-lg ${color} ${pad} overflow-hidden transition-all
               duration-300 shadow-black shadow-md`}
    >
      <Icon
        size={size}
        className="text-white transition-transform duration-300 group-hover:-translate-x-10"
      />

      <div
        className="absolute left-1/2 transform -translate-x-1/4 opacity-0 whitespace-nowrap
                text-white font-semibold transition-all duration-300 group-hover:opacity-100"
      >
        {text}
      </div>

      <style>
        {`
            button.group:hover {
                width: ${w2};
            }
        `}
      </style>
    </button>
  );
};

export default AnimatedButton;
