import { useContext, useState } from "react";
import Header from "../../Components/Header";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { delivery_history_context } from "../../Contexts";
import DeliveryHistoryCompo from "../../Components/DeliveryHistoryCompo";

const History = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const [delivery_history, setDelivery_history] = useContext(
    delivery_history_context
  );

  const filteredDeliveries = delivery_history.filter((delivery) => {
    const query = searchQuery.toLowerCase();
    const totalString = delivery.totalPrice?.toString() || "";
    const delivered_at = delivery.delivered_at?.toString() || "";
    const addressString = `${delivery.lat}, ${delivery.lng}`.toLowerCase();

    return (
      delivery.serialNum?.toString().toLowerCase().includes(query) ||
      addressString.includes(query) ||
      delivered_at.includes(query) ||
      totalString.includes(query)
    );
  });

  return (
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={BsFillBoxSeamFill}
        title="Delivery History"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => setModalOpen(true)}
        button={false}
        searchBTN={true}
        excelBtn={true}
        Excel_Data={filteredDeliveries.filter(
          (delivery) => delivery.delivered === true
        )}
        Excel_text={"Deliveries History"}
      />
      <div className="w-full h-[95%] overflow-auto scrollbar-none pr-1">
        {filteredDeliveries.length === 0 ? (
          <p>No orders delivered yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredDeliveries
              .filter((delivery) => delivery.delivered === true)
              .map((delivery) => (
                <DeliveryHistoryCompo key={delivery.id} delivery={delivery} />
              ))}
            {filteredDeliveries
              .filter((delivery) => delivery.delivered === true)
              .map((delivery) => (
                <DeliveryHistoryCompo key={delivery.id} delivery={delivery} />
              ))}
            {filteredDeliveries
              .filter((delivery) => delivery.delivered === true)
              .map((delivery) => (
                <DeliveryHistoryCompo key={delivery.id} delivery={delivery} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
