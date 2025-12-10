import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Components/Header";
import { FaTruck } from "react-icons/fa";
import { API } from "../../API_URL";
import ExportToExcel from "../../Components/ExportToExcel";

const AssignDeliveries = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const token = localStorage.getItem("token");

  const fetchDeliveries = async () => {
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
      setDeliveries(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/users/all_users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (orderId, userId) => {
    try {
      const res = await fetch(`${API}/delivery/assign_delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, userId }),
      });

      if (!res.ok) throw new Error("Failed to assign delivery");
      const data = await res.json();

      setDeliveries((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, driverId: userId, driverName: data.driverName }
            : order
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDeliveries();
  }, []);

  const filteredDeliveries = useMemo(() => {
    if (!searchQuery) return deliveries;
    const searchLower = searchQuery.toLowerCase();
    return deliveries.filter((order) => {
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
  }, [searchQuery, deliveries]);

  const pendingDeliveries = useMemo(
    () =>
      filteredDeliveries.filter(
        (order) => order.type === "delivery" && order.status === "pending"
      ),
    [filteredDeliveries]
  );

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">Loading orders...</div>
    );
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  return (
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaTruck}
        title="Assign Deliveries"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => setModalOpen(true)}
        button={false}
      />

      <div className="overflow-x-auto h-[95%]">
        {pendingDeliveries.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="min-w-full font-semibold text-black bg-white rounded-lg table-auto">
            <thead className="bg-mainColor text-white">
              <tr>
                <th className="p-2 w-[15%] text-left">Serial number</th>
                <th className="p-2 w-[10%] text-left">Type</th>
                <th className="p-2 w-[15%] text-left">Total price</th>
                <th className="p-2 w-[15%] text-left">Status</th>
                <th className="p-2 w-[20%] text-left">Delivery Guy</th>
                <th className="p-2 w-[15%] text-left">Created at</th>
                <th className="p-2 w-[10%]">
                  <div className="flex items-center justify-center gap-5 w-full">
                    Actions{" "}
                    <ExportToExcel
                      data={pendingDeliveries}
                      fileName="Deliveries"
                      sheetName="Deliveries"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingDeliveries.map((order, index) => {
                const createdAt = order.createdAt.split("T")[0];
                return (
                  <tr
                    key={order.id}
                    className={`${index % 2 === 0 ? "bg-green-100" : ""}`}
                  >
                    <td className="p-2">{order.serialNum}</td>
                    <td className="p-2 capitalize">{order.type}</td>
                    <td className="p-2">${order.totalPrice}</td>
                    <td className="p-2 capitalize">{order.status}</td>
                    <td className="p-2">
                      <select
                        className="bg-transparent w-[75%] outline-none"
                        value={order.driverId || ""}
                        onChange={(e) => handleAssign(order.id, e.target.value)}
                      >
                        <option value="">Select</option>
                        {users
                          .filter((guy) => guy.role === "delivery")
                          .map((guy) => (
                            <option key={guy.id} value={guy.id}>
                              {guy.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="p-2">{createdAt}</td>
                    <td className="p-2">button button</td>
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

export default AssignDeliveries;
