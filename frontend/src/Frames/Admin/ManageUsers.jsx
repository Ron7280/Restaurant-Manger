import React, { useState } from "react";
import Header from "../../Components/Header";
import { FaUsers } from "react-icons/fa";

const ManageUsers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = () => {};
  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaUsers}
        title="Manage Users"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default ManageUsers;
