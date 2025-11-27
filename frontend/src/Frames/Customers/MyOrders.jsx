import React, { useEffect, useState, useMemo } from "react";
import { API } from "../../API_URL";
import MyOrderCompo from "../../Components/MyOrderCompo";
import { FaSearch } from "react-icons/fa";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/order/my_orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    return orders.filter((order) => {
      const created = new Date(order.createdAt);
      const date = created.toLocaleDateString();
      const time = created.toLocaleTimeString();
      const total = order.totalPrice.toFixed(2);
      const status = order.status.toLowerCase();
      const searchLower = search.toLowerCase();

      return (
        date.includes(searchLower) ||
        time.includes(searchLower) ||
        total.includes(searchLower) ||
        status.includes(searchLower)
      );
    });
  }, [search, orders]);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">Loading orders...</div>
    );
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-4 flex w-full h-full flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex w-[30%] items-center gap-2 font-bold text-center">
          <div className="w-[25%] flex text-2xl  justify-start">My Orders</div>
          <div className="bg-mainColor rounded-lg p-1 shadow-black shadow-md text-center min-w-[20%] max-w-[30%]">
            {filteredOrders.length}
          </div>
        </div>

        <div className="flex justify-between w-[30%] rounded-lg bg-white items-center pl-2 pr-2 shadow-md shadow-black">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order . . ."
            className="w-full bg-transparent outline-none text-black font-semibold p-2"
          />
          <FaSearch className="text-emerald-400" />
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-gray-500 text-center mt-4">No orders found.</div>
      )}

      <div className="grid grid-rows-3 grid-cols-3 gap-3 pr-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-mainColor scrollbar-track-transparent">
        {filteredOrders.map((order) => (
          <MyOrderCompo
            key={order.id}
            order={order}
            fetchOrders={fetchOrders}
          />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
