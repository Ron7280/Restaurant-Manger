import { useState } from "react";
import { MdDelete } from "react-icons/md";
import AnimatedButton from "./AnimatedButton";
import { FaDollarSign } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { TbListDetails } from "react-icons/tb";
import { FaReceipt } from "react-icons/fa6";
import { GrStatusInfo } from "react-icons/gr";
import { API } from "../API_URL";

const MyOrderCompo = ({ order, fetchOrders }) => {
  const [details, setDetails] = useState(false);
  const token = localStorage.getItem("token");

  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`${API}/order/delete_my_order`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error("Failed to delete order");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div
      key={order.id}
      className="border rounded-xl h-fit p-4 shadow-black shadow-lg
       transition-shadow duration-200 flex flex-col gap-3 bg-white"
    >
      <div className="flex justify-between items-center">
        <div className="text-gray-700 w-full gap-1 flex flex-col font-semibold">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-1">
              <FaReceipt size={20} /> Order Num : {order.serialNum}
            </div>

            <AnimatedButton
              func={() => deleteOrder(order.id)}
              color="bg-Red"
              icon={MdDelete}
              size={25}
              text="Delete"
              w1="10%"
              w2="25%"
              pad=""
            />
          </div>
          <div className="flex items-center gap-1">
            <FaDollarSign size={20} /> Total : ${order.totalPrice.toFixed(2)}
          </div>
          <div className="flex items-center gap-1">
            <GrStatusInfo size={20} />
            Status : {order.status}
          </div>

          <div className="flex  justify-between  text-gray-500">
            <div className="flex gap-1 items-center">
              <MdOutlineAccessTimeFilled size={20} /> Created :
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <AnimatedButton
              func={() => setDetails(!details)}
              color="bg-blue-500"
              icon={TbListDetails}
              size={25}
              text="Details"
              w1="10%"
              w2="25%"
              pad=""
            />
          </div>
        </div>
      </div>
      {details && (
        <div className="font-semibold">
          <div className="text-gray-600 flex  justify-between">
            <div className="flex items-center w-[60%] gap-1 font-semibold ">
              <GiMeal size={20} /> Items :
            </div>
            <div className="w-[20%]">Price</div>
            <div className="w-[20%]">Quantity</div>
          </div>
          <div className="pl-10 text-gray-700">
            {order.orderItems.map((item) => (
              <div className=" flex justify-between" key={item.id}>
                <div className="w-[60%]">
                  {item.menuItem?.name || "Unknown Item"}
                </div>
                <div className="w-[20%]">${item.menuItem?.price}</div>
                <div className="w-[20%]">{item.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrderCompo;
