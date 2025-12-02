import React, { useState } from "react";
import { MdImageNotSupported } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { API } from "../API_URL";

const ViewMenuCompo = ({ item, onAddToOrder }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl max-w-96 min-w-80 h-96 shadow-md overflow-hidden flex flex-col">
        <div className="w-full h-[50%] bg-gray-100 flex items-center justify-center relative cursor-pointer">
          {item.imageUrl ? (
            <img
              src={`${API}${item.imageUrl}`}
              alt={item.name}
              className="w-full h-full object-cover"
              onClick={() => setIsFullScreen(true)}
            />
          ) : (
            <MdImageNotSupported size={40} className="text-gray-400" />
          )}
          {item.category && (
            <div
              className="absolute top-2 left-2 bg-yellow-400 text-center
               text-black p-1 min-w-[20%] max-w-[40%] rounded-md text-xs
                font-bold"
            >
              {item.category}
            </div>
          )}
        </div>

        <div className="p-2 flex flex-col h-[50%]">
          <div className="text-lg font-bold text-gray-800 h-[20%]">
            {item.name}
          </div>
          <div className="text-gray-500 flex-1 h-[60%] overflow-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-400/50">
            {item.description}
          </div>

          <div className="flex h-[20%] justify-between gap-3 items-center">
            <div className="font-semibold w-[30%] pl-2 pr-2 max-w-[50%] text-center rounded-full bg-gray-200 text-gray-700">
              ${item.price.toFixed(2)}
            </div>
            <button
              onClick={() => onAddToOrder(item)}
              className="flex items-center justify-center gap-1 w-full bg-mainColor text-white p-1 rounded-md font-semibold"
            >
              <FaCartArrowDown size={20} /> Add to Order
            </button>
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setIsFullScreen(false)}
        >
          <img
            src={`${API}${item.imageUrl}`}
            alt={item.name}
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      )}
    </>
  );
};

export default ViewMenuCompo;
