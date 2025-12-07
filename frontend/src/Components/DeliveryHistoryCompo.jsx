import { IoReceiptSharp, IoHomeSharp } from "react-icons/io5";
import { FaDollarSign } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { API } from "../API_URL";

const DeliveryHistoryCompo = ({ delivery }) => {
  const [address, setAddress] = useState("");

  const getAddress = async () => {
    if (delivery.lat && delivery.lng) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${delivery.lat}&lon=${delivery.lng}&format=json`
        );
        const data = await response.json();
        setAddress(data.display_name || "Unknown Address");
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Unable to fetch address");
      }
    }
  };

  useEffect(() => {
    getAddress();
  }, [delivery.lat, delivery.lng]);

  return (
    <div
      className="bg-white shadow-md shadow-black rounded-xl gap-3
    border-l-8 border-l-mainColor border-r-8 border-r-Indigo w-full flex 
    flex-col justify-between p-3"
    >
      <div className="flex flex-col gap-3">
        <div className="text-lg flex items-center gap-1 w-[50%] font-bold text-black">
          <div
            className="flex gap-1 items-center w-[30%] justify-center
            text-white bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg "
          >
            <IoReceiptSharp size={25} /> Order
          </div>
          <div className="font-medium">{delivery.serialNum}</div>
        </div>

        <div className="flex flex-col gap-2 text-black">
          <div className="flex items-center gap-2 font-bold">
            <div className="bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg ">
              <IoTimeOutline size={25} className="text-white" />
            </div>
            Deliverd at
            <div className="font-semibold">
              {delivery.delivered_at.split("T")[0]} -{" "}
              {delivery.delivered_at.split("T")[1].split(".")[0]}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-black">
          <div className="flex items-center gap-2 font-bold">
            <div className="bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg ">
              <IoHomeSharp size={25} className="text-white" />
            </div>
            Address
          </div>

          <div className="font-semibold">
            {address || "Fetching address..."}
          </div>
        </div>

        <div>
          <div className="text-lg font-semibold text-gray-800 mb-2">Items:</div>
          <div className="flex flex-col gap-2 text-black">
            {delivery.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-indigo-100 rounded-lg p-1"
              >
                <img
                  src={`${API}${item.imageUrl}`}
                  className="w-10 h-10 rounded-xl"
                />
                <div className="font-medium w-[30%] justify-start">
                  {item.name}
                </div>

                <div className="flex text-gray-700 justify-center font-semibold w-[30%]">
                  x {item.quantity}
                </div>
                <div className="font-semibold w-[30%] flex justify-end text-gray-900">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
        <div className="flex items-center justify-center gap-1 w-[15%] text-white bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg">
          <FaDollarSign size={20} /> Total
        </div>
        ${delivery.totalPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default DeliveryHistoryCompo;
