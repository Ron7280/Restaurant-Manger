import { useState } from "react";
import Header from "../../Components/Header";
import { FaTruckArrowRight } from "react-icons/fa6";

const SuppliesToBuy = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaTruckArrowRight}
        title="Supplies To Buy"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => {}}
        button={true}
      />
      <div className="overflow-x-auto h-[95%]"></div>
    </div>
  );
};

export default SuppliesToBuy;
