import React, { useContext, useEffect, useMemo, useState } from "react";
import Header from "../../Components/Header";
import { FaReceipt } from "react-icons/fa";
import { API } from "../../API_URL";
import { delivery_orders_context } from "../../Contexts";
import ExportToExcel from "../../Components/ExportToExcel";

const ViewOrders = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [delivery_orders, setDelivery_orders] = useContext(
    delivery_orders_context
  );

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/order/all_orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
      const data = await res.json();

      setOrders(data);
      setDelivery_orders(data);
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
    const searchLower = searchQuery.toLowerCase();
    return orders.filter((order) => {
      const created = new Date(order.createdAt);
      const createdAt = created.toLocaleDateString();
      const serialNum = order.serialNum.toLowerCase();
      const type = order.type.toLowerCase();
      const total = order.totalPrice.toFixed(2);
      const status = order.status.toLowerCase();

      return (
        serialNum.includes(searchLower) ||
        type.includes(searchLower) ||
        total.includes(searchLower) ||
        status.includes(searchLower) ||
        createdAt.includes(searchLower)
      );
    });
  }, [searchQuery, orders]);

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">Loading orders...</div>
    );
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaReceipt}
        title="View Orders"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => setModalOpen(true)}
        button={false}
        searchField={true}
      />
      <div className="overflow-x-auto h-[95%]">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="min-w-full font-semibold text-black bg-white rounded-lg table-auto">
            <thead className="bg-mainColor text-white">
              <tr>
                <th className="p-2 w-[15%] text-left">Serial number</th>
                <th className="p-2 w-[20%] text-left">Type</th>
                <th className="p-2 w-[20%] text-left">Total price</th>
                <th className="p-2 w-[20%] text-left">Status</th>
                <th className="p-2 w-[15%] text-left">created at</th>
                <th className="p-2 w-[10%]">
                  <div className="flex items-center justify-center gap-5 w-full">
                    Actions
                    <ExportToExcel
                      data={filteredOrders}
                      fileName="Orders"
                      sheetName="Orders"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const createdAt = order.createdAt.split("T")[0];
                return (
                  <tr
                    key={order.id}
                    className={`${index % 2 == 0 ? "bg-green-100" : ""}`}
                  >
                    <td className="p-2">{order.serialNum}</td>
                    <td className="p-2 capitalize">{order.type}</td>
                    <td className="p-2">${order.totalPrice}</td>
                    <td className="p-2 capitalize">{order.status}</td>
                    <td className="p-2 ">{createdAt}</td>
                    <td className="p-2 ">button button</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;
