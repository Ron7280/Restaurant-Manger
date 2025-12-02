import React, { useState } from "react";
import Header from "../../Components/Header";
import { FaTruck } from "react-icons/fa";

const AssignDeliveries = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = () => {};
  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaTruck}
        title="Assign Deliveries"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        setModalOpen={setModalOpen}
        button={true}
      />
    </div>
  );
};

export default AssignDeliveries;
