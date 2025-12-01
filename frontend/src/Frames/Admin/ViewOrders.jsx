import React, { useState } from "react";
import Header from "../../Components/Header";
import { FaReceipt } from "react-icons/fa";

const ViewOrders = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
