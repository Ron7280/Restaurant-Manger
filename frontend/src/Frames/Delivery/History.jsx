import React, { useState } from "react";
import Header from "../../Components/Header";
import { BsFillBoxSeamFill } from "react-icons/bs";

const History = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = () => {};
  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={BsFillBoxSeamFill}
        title="Delivery History"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => setModalOpen(true)}
        button={false}
        searchBTN={true}
      />
    </div>
  );
};

export default History;
