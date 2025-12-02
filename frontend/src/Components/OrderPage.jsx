import { useLocation, useNavigate } from "react-router-dom";
import { MdDeliveryDining } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
import { API } from "../API_URL";
import { BiDuplicate } from "react-icons/bi";

const OrderPage = () => {
  const location = useLocation();
  const order = location.state?.order || [];
  const [orderList, setOrderList] = useState(order);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const increaseQty = (id) => {
    setOrderList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setOrderList((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const sendOrder = async () => {
    const res = await fetch(`${API}/order/order_now`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: orderList.map((i) => ({
          menuItemId: i.id,
          quantity: i.qty,
        })),
        totalPrice,
        type: "order",
      }),
    });
    const data = await res.json();

    if (data.success) {
      navigate("/menu/viewMenu");
      return;
    }
    if (!res.ok) throw new Error("Failed to send order");
  };

  const sendDelivery = async () => {
    const res = await fetch(`${API}/order/delivery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: orderList.map((i) => ({
          menuItemId: i.id,
          quantity: i.qty,
        })),
        totalPrice,
        type: "delivery",
      }),
    });
    const data = await res.json();

    if (data.success) {
      navigate("/menu/viewMenu");
      return;
    }

    if (!res.ok) throw new Error("Failed to send delivery order");
  };

  const totalPrice = orderList.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const uniqueGroups = orderList.length;

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <div
        className="w-[45%] h-[80%] bg-white shadow-lg text-black shadow-black
       rounded-2xl p-3 justify-between flex flex-col"
      >
        <div className="flex h-[80%] flex-col gap-3">
          <div className="font-bold text-xl w-full text-center ">
            Your Order
          </div>
          <div
            className="flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-mainColor
          h-full pr-2 scrollbar-track-transparent"
          >
            {order.length === 0 && (
              <div className="text-gray-500">No items selected.</div>
            )}

            {orderList.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-xl items-center shadow-md p-2 flex gap-3 border border-gray-200"
              >
                <img
                  className="min-w-[15%] max-w-[15%] h-24 rounded-lg object-cover"
                  src={`${API}${item.imageUrl}`}
                  alt={item.name}
                />

                <div className="w-[85%] flex flex-col gap-6">
                  <div className="grid grid-cols-4 font-bold text-gray-700 text-sm pb-1 border-b">
                    <div>Order</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-center">Price</div>
                    <div className="text-right">Total</div>
                  </div>

                  <div className="grid grid-cols-4 items-center text-lg text-gray-800">
                    <div className="font-semibold">{item.name}</div>

                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-5 h-5 items-center flex justify-center bg-Red text-white rounded-lg"
                      >
                        <IoIosRemove />
                      </button>

                      <div className="w-8 text-center font-semibold">
                        {item.qty}
                      </div>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-5 h-5 items-center flex justify-center bg-mainColor text-white rounded-lg"
                      >
                        <IoMdAdd />
                      </button>
                    </div>

                    <div className="text-center text-gray-600">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="text-right font-bold text-emerald-600">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full p-3 h-[20%] flex flex-col justify-between">
          <div className="flex justify-between text-lg font-semibold">
            <div>Unique Items :</div>
            <div className="mt-2 font-semibold w-[20%] max-w-[40%] text-center rounded-full bg-red-200 text-black">
              {uniqueGroups}
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <div>Total :</div>
            <div className="mt-2 font-semibold w-[20%] max-w-[40%] text-center rounded-full bg-red-200 text-black">
              ${totalPrice.toFixed(2)}
            </div>
          </div>

          <div className="flex gap-5">
            <button
              onClick={sendOrder}
              className="w-full flex items-center justify-center gap-2 font-bold bg-green-600 text-white p-2 rounded-md"
            >
              <GiMeal size={25} /> Order
            </button>

            <button
              onClick={sendDelivery}
              className="w-full flex items-center justify-center gap-2 font-bold bg-blue-600 text-white p-2 rounded-md"
            >
              <MdDeliveryDining size={25} /> Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
