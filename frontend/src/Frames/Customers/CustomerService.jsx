import React, { useState } from "react";
import Header from "../../Components/Header";
import { RiCustomerService2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const CustomerService = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearch(e.target.value);

  return (
    <div className="p-3 pb-0 flex w-full h-full flex-col gap-3">
      <Header
        icon={RiCustomerService2Fill}
        title="Customer Service"
        searchQuery={search}
        handleSearchChange={handleSearchChange}
        button={false}
        searchField={false}
      />
      <div className="h-[95%]"></div>
    </div>
  );
};

export default CustomerService;
