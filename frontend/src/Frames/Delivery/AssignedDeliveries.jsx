import React, { useState, useEffect, useContext } from "react";
import Header from "../../Components/Header";
import { FaTruck } from "react-icons/fa";
import { API } from "../../API_URL";
import DeliveryCard from "../../Components/DeliveryCard ";
import { delivery_history_context } from "../../Contexts";
const AssignedDeliveries = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [delivery_history, setDelivery_history] = useContext(
    delivery_history_context
  );
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(`${API}/delivery/my_delivery`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      const data = await res.json();
      setDeliveries(data);
      setDelivery_history(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const query = searchQuery.toLowerCase();
    const totalString = delivery.totalPrice?.toString() || "";
    const addressString = `${delivery.lat}, ${delivery.lng}`.toLowerCase();

    return (
      delivery.serialNum?.toString().toLowerCase().includes(query) ||
      addressString.includes(query) ||
      totalString.includes(query)
    );
  });

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

      {filteredDeliveries.length === 0 ? (
        <p>No deliveries assigned yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredDeliveries
            .filter((delivery) => delivery.delivered === false)
            .map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                fetchDeliveries={fetchDeliveries}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AssignedDeliveries;
