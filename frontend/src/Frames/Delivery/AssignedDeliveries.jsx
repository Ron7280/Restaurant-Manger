import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { FaTruck } from "react-icons/fa";
import { API } from "../../API_URL";
import DeliveryCard from "../../Components/DeliveryCard ";
const AssignedDeliveries = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(`${API}/order/my_delivery`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      const data = await res.json();
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaTruck}
        title="Assigned Deliveries"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => setModalOpen(true)}
        button={false}
        searchBTN={true}
      />

      {deliveries.length === 0 ? (
        <p>No deliveries assigned yet.</p>
      ) : (
        <div className="grid grid-cols-2  gap-6">
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedDeliveries;
