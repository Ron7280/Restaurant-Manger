import React, { useEffect, useState, useMemo } from "react";
import { API } from "../../API_URL";
import MyOrderCompo from "../../Components/MyOrderCompo";
import { FaClipboardList, FaSearch } from "react-icons/fa";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearch(e.target.value);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/order/my_orders`, {
        headers: {
          "Content-Type": "application/json",
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
    if (!search.trim()) return orders;

    const searchLower = search.toLowerCase();

    return orders.filter((order) => {
      const created = new Date(order.createdAt);

      const date = created.toLocaleDateString().toLowerCase();
      const time = created.toLocaleTimeString().toLowerCase();

      const total = order.totalPrice.toString().toLowerCase();
      const status = order.status.toLowerCase();
      const id = order.id?.toString().toLowerCase();

      return (
        date.includes(searchLower) ||
        time.includes(searchLower) ||
        total.includes(searchLower) ||
        status.includes(searchLower) ||
        id.includes(searchLower)
      );
    });
  }, [search, orders]);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">Loading orders...</div>
    );
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-4 flex w-full h-full flex-col gap-3">
      <Header
        icon={FaClipboardList}
        title="My Orders"
        searchQuery={search}
        handleSearchChange={handleSearchChange}
        setModalOpen={() => navigate("/menu/viewMenu")}
        button={true}
        searchBTN={true}
      />

      {filteredOrders.length === 0 && (
        <div className="text-gray-500 text-center h-[95%] flex flex-col justify-center items-center">
          No orders found.
        </div>
      )}

      <div className="grid grid-rows-3 grid-cols-3 gap-3 pr-1 overflow-y-auto h-[95%] scrollbar-thin scrollbar-thumb-mainColor scrollbar-track-transparent">
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
