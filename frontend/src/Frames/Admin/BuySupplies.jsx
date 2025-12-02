import React, { useState } from "react";
import Header from "../../Components/Header";
import { HiBuildingStorefront } from "react-icons/hi2";

const BuySupplies = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = () => {};
  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={HiBuildingStorefront}
        title="Buy Supplies"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        setModalOpen={setModalOpen}
        button={true}
      />
    </div>
  );
};

export default BuySupplies;
