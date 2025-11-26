import React from "react";
import { MdImageNotSupported } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";

const ViewMenuCompo = ({ item, onAddToOrder }) => {
  return (
    <div className="bg-white rounded-xl max-w-96 min-w-80 h-96 shadow-md overflow-hidden flex flex-col">
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <MdImageNotSupported size={40} className="text-gray-400" />
        )}
        {item.category && (
          <div
            className="absolute top-2 left-2 bg-yellow-400 text-center
           text-black p-1 min-w-[20%] max-w-[40%] rounded-md text-xs font-semibold
            font-semibold"
          >
            {item.category}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-lg font-bold text-gray-800">{item.name}</div>
        <div className="text-gray-500 flex-1">{item.description}</div>
        <div className="mt-2 font-semibold w-[30%] max-w-[50%] text-center rounded-full bg-gray-200 text-gray-700">
          ${item.price.toFixed(2)}
        </div>
        <button
          onClick={() => onAddToOrder(item)}
          className="flex items-center justify-center gap-1 bg-mainColor text-white  p-1 rounded-md font-semibold"
        >
          <FaCartArrowDown size={20} /> Add to Order
        </button>
      </div>
    </div>
  );
};

export default ViewMenuCompo;
