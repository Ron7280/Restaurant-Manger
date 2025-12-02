import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Components/Header";
import { FaReceipt } from "react-icons/fa";
import { API } from "../../API_URL";

const ViewOrders = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/order/all_orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
      const data = await res.json();
      setOrders(data);
      console.log("data --> ", data);
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
    if (!searchQuery) return orders;
    return orders.filter((order) => {
      const created = new Date(order.createdAt);
      const date = created.toLocaleDateString();
      const time = created.toLocaleTimeString();
      const total = order.totalPrice.toFixed(2);
      const status = order.status.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      return (
        date.includes(searchLower) ||
        time.includes(searchLower) ||
        total.includes(searchLower) ||
        status.includes(searchLower)
      );
    });
  }, [searchQuery, orders]);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">Loading orders...</div>
    );
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  const handleSearchChange = () => {};
  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaReceipt}
        title="View Orders"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default ViewOrders;
