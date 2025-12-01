import React, { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import AddItemModal from "../../Modals/AddItemModal";
import { API } from "../../API_URL";
import ItemTable from "../../Components/ItemTable";
import Header from "../../Components/Header";

const ManageInventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    unit: "",
    category: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch(`${API}/inventory/inventory_items`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch inventory items");
      const data = await response.json();
      console.log(data);
      setInventoryItems(data);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = inventoryItems.filter(
    (item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.unit?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!form.name.trim() || !form.category || !form.unit) {
      alert("Please provide name, category, and unit.");
      setSaving(false);
      return;
    }

    const quantity = parseFloat(form.quantity);
    if (isNaN(quantity)) {
      alert("Please provide a valid quantity.");
      setSaving(false);
      return;
    }

    const itemData = {
      name: form.name.trim(),
      quantity: quantity,
      unit: form.unit.trim(),
      category: form.category?.trim(),
      imageUrl: form.imageUrl?.trim() || null,
    };

    try {
      const response = await fetch(`${API}/inventory/add_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemData }),
      });

      const data = await response.json();
      if (response.ok) {
        setInventoryItems((prevItems) => [...prevItems, data.item]);
        alert("Item added successfully!");
      } else {
        alert(data.error || "Error adding item.");
      }
    } catch (error) {
      alert("Error adding item.");
      console.error("Error adding item:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaBoxOpen}
        title="Manage Inventory"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        setModalOpen={setModalOpen}
      />

      <div className="flex flex-col gap-3 w-full h-[95%] ">
        <ItemTable
          filteredItems={filteredItems}
          quantityFilter={50}
          comparisonType=">"
        />

        <ItemTable
          filteredItems={filteredItems}
          quantityFilter={50}
          comparisonType="<"
        />
      </div>

      {modalOpen && (
        <AddItemModal
          handleSave={handleAddItem}
          setModalOpen={setModalOpen}
          form={form}
          setForm={setForm}
          saving={saving}
        />
      )}
    </div>
  );
};

export default ManageInventory;
