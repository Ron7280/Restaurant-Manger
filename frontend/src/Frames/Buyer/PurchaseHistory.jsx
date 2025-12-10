import { useState } from "react";
import Header from "../../Components/Header";
import { BiSolidPurchaseTag } from "react-icons/bi";

const PurchaseHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={BiSolidPurchaseTag}
        title="Purchase History"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => {}}
        button={true}
      />
      <div className="overflow-x-auto h-[95%]"></div>
    </div>
  );
};

export default PurchaseHistory;
