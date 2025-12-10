import { IoReceiptSharp, IoHomeSharp } from "react-icons/io5";
import { FaDollarSign, FaMapMarkedAlt, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCheckToSlot } from "react-icons/fa6";
import Loader from "./Loader";
import { API } from "../API_URL";

const DeliveryCard = ({ delivery, fetchDeliveries }) => {
  const [delivering, setDelivering] = useState(false);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const Deliver = async () => {
    setDelivering(true);

    try {
      const response = await fetch(`${API}/delivery/delivering`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: delivery.orderId }),
      });

      const data = await response.json();
    } catch (error) {
      console.error("Error updating delivery:", error);
    }
  };

  const Delivered = async () => {
    setDelivering(false);

    try {
      const response = await fetch(`${API}/delivery/delivered`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: delivery.orderId }),
      });

      const data = await response.json();
      if (data.success) {
        fetchDeliveries();
      }
    } catch (error) {
      console.error("Error updating delivery:", error);
    }
  };

  return (
    <div
      className="bg-white shadow-md shadow-black rounded-xl gap-3
          border-l-8 border-l-mainColor border-r-8 border-r-Indigo w-full flex 
          flex-col justify-between p-3 "
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center w-full">
          <div className="text-lg flex items-center gap-1 w-[50%] font-bold text-black">
            <div
              className="flex gap-1 items-center w-[30%] justify-center
            text-white bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg "
            >
              <IoReceiptSharp size={25} /> Order
            </div>
            <div className="font-medium ">{delivery.serialNum}</div>
          </div>

          <div className="flex gap-3 w-[50%] font-semibold ">
            {delivering ? (
              <button
                onClick={Delivered}
                className="flex  items-center text-white gap-3 p-1 rounded-lg
              shadow-black shadow-md justify-center bg-mainColor w-[50%] "
              >
                Delivered <FaCheckToSlot size={20} />
              </button>
            ) : (
              <></>
            )}
            <button
              onClick={() =>
                navigate("/menu/trackMap", {
                  state: {
                    lat: delivery.lat,
                    lng: delivery.lng,
                    name: delivery.customerName,
                    mobile: delivery.customerMobile,
                    serialNum: delivery.serialNum,
                  },
                })
              }
              className={`flex  items-center text-white gap-3 p-1 rounded-lg
            shadow-black shadow-md justify-center ${
              delivering ? "bg-blue-500" : "bg-mainColor"
            } w-[50%]`}
            >
              View Map <FaMapMarkedAlt size={20} />
            </button>
            <button
              onClick={Deliver}
              className=" rounded-lg flex justify-center shadow-black shadow-md  bg-Indigo w-[50%]"
            >
              {delivering ? (
                <Loader type="dots" />
              ) : (
                <div className="flex  items-center justify-center text-white gap-3 p-1">
                  Deliver <FaTruck size={20} />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-black">
          <div className="flex items-center gap-2 font-bold">
            <div className="bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg ">
              <IoHomeSharp size={25} className=" text-white" />
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
        <div className="flex items-center justify-center gap-1 w-[15%] text-white bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg ">
          <FaDollarSign size={20} /> Total
        </div>
        ${delivery.totalPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default DeliveryCard;
