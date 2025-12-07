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
            <div className="flex flex-col gap-2 text-black">
              <div className="flex items-center gap-2 font-bold">
                <div
                  className="flex gap-1 items-center w-full pr-2 pl-2 justify-center
            text-white bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg "
                >
                  <FaReceipt size={25} className=" text-white" />
                  Order
                </div>
                {order.serialNum}
              </div>
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

          <div className="flex items-center gap-2 font-bold">
            <div className="bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg ">
              <FaDollarSign size={20} className=" text-white" />
            </div>
            Total : ${order.totalPrice.toFixed(2)}
          </div>

          <div className="flex items-center gap-2 font-bold">
            <div className="bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg ">
              <GrStatusInfo size={20} className=" text-white" />
            </div>
            Status : {order.status}
          </div>

          <div className="flex  justify-between  text-gray-500">
            <div className="flex items-center gap-2 font-bold">
              <div className="bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg ">
                <MdOutlineAccessTimeFilled size={20} className=" text-white" />
              </div>
              Created :{new Date(order.createdAt).toLocaleString()}
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
            <div className="flex items-center gap-2 font-bold w-[60%]">
              <div className="bg-gradient-to-tr from-mainColor to-Indigo p-1 rounded-lg ">
                <GiMeal size={20} className=" text-white" />
              </div>
              Items :
            </div>

            <div className="w-[20%]">Price</div>
            <div className="w-[20%]">Quantity</div>
          </div>
          <div className="pl-10 text-gray-700">
            {order.orderItems.map((item, index) => (
              <div className=" flex justify-between" key={item.id}>
                <div className="w-[60%]">
                  {index + 1} - {item.menuItem?.name || "Unknown Item"}
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
