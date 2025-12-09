import React, { useState } from "react";
import { MdDelete, MdImageNotSupported } from "react-icons/md";
import { FaTableList } from "react-icons/fa6";
import { BiSolidHide } from "react-icons/bi";
import EditTableItemModal from "../Modals/EditTableItemModal";
import { FaEdit } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";
import { API } from "../API_URL";
import DeleteModal from "../Modals/DeleteModal";
import { useNavigate } from "react-router-dom";
import BuySuppliesModal from "../Modals/BuySuppliesModal";

const ItemTable = ({
  title,
  filteredItems,
  quantityFilter,
  comparisonType,
  fetchInventoryItems,
  categoryFilter,
}) => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [buyingItem, setBuyingItem] = useState(null);
  const [buying, setBuying] = useState(false);
  const [buyForm, setBuyForm] = useState({
    buyQuantity: "",
  });

  const [form, setForm] = useState({
    id: "",
    name: "",
    quantity: "",
    unit: "",
    category: "",
    imageUrl: "",
    imagePreview: null,
  });

  const applyFilter = (itemQuantity) => {
    switch (comparisonType) {
      case ">":
        return parseFloat(itemQuantity) > quantityFilter;
      case ">=":
        return parseFloat(itemQuantity) >= quantityFilter;
      case "<=":
        return parseFloat(itemQuantity) >= quantityFilter;
      case "<":
        return parseFloat(itemQuantity) < quantityFilter;
      case "=":
        return parseFloat(itemQuantity) === quantityFilter;
      default:
        return false;
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      imageUrl: item.imageUrl,
      imagePreview: item.imageUrl,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const { id, name, quantity, unit, category, imageUrl } = form;

    const updatedItem = {
      id,
      name,
      quantity: parseFloat(quantity),
      unit,
      category,
      imageUrl,
    };

    const formData = new FormData();

    formData.append("updatedItem", JSON.stringify(updatedItem));

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      const response = await fetch(`${API}/inventory/edit_item`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const data = await response.json();
      if (data.success) {
        fetchInventoryItems();
      }

      setModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`${API}/inventory/delete_item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: itemId }),
      });

      const data = await response.json();

      if (data.success) {
        fetchInventoryItems();
        setConfirmOpen(false);
      } else {
        alert(data.error || "Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item.");
    }
  };

  const handleBuy = async () => {
    if (!buyForm.buyQuantity || parseFloat(buyForm.buyQuantity) <= 0) {
      alert("Please enter a valid quantity to buy");
      return;
    }

    setBuying(true);

    try {
      const response = await fetch(`${API}/supplies/supply_purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_name: buyingItem.name,
          quantity: parseFloat(buyForm.buyQuantity),
          unit: buyingItem.unit,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBuyOpen(false);
        setBuyForm({ buyQuantity: "" });
      } else {
        alert(data.error || "Failed to submit purchase request.");
      }
    } catch (error) {
      console.error("Error submitting purchase:", error);
      alert("Error submitting purchase request.");
    }

    setBuying(false);
  };

  return (
    <div
      title={title}
      className=" bg-white text-black font-semibold rounded-lg shadow-md"
    >
      <table className="w-full table-auto">
        <thead
          className={`${
            comparisonType === "<" ? "bg-red-600" : "bg-mainColor"
          } text-white`}
        >
          <tr>
            <th className="p-2 w-[10%]">Image</th>
            <th className="p-2 w-[20%]">Item</th>
            <th className="p-2 w-[20%]">Category</th>
            <th className="p-2 w-[20%]">Quantity</th>
            <th className="p-2 w-[20%]">Unit</th>
            <th className="p-2 w-[10%]">
              <div className="flex justify-center gap-5">
                <div>Actions</div>
                <button onClick={() => setIsTableVisible((prev) => !prev)}>
                  {isTableVisible ? <BiSolidHide /> : <FaTableList />}
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody style={{ display: isTableVisible ? "table-row-group" : "none" }}>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No items found.
              </td>
            </tr>
          ) : (
            filteredItems
              .filter((item) => applyFilter(item.quantity))
              .filter((item) => item.category === categoryFilter)
              .map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b text-center  ${
                    index % 2 == 0
                      ? comparisonType === "<"
                        ? "bg-red-100"
                        : "bg-green-100"
                      : ""
                  }`}
                >
                  <td className=" p-2">
                    {item.imageUrl ? (
                      <img
                        src={`${API}${item.imageUrl}`}
                        className="w-auto h-10 mx-auto object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <MdImageNotSupported className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td
                    className={`p-2 ${
                      item.quantity < quantityFilter ? "text-Red" : ""
                    }`}
                  >
                    {item.quantity}
                  </td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => {
                          setBuyingItem(item);
                          setBuyOpen(true);
                        }}
                        className="text-blue-700"
                      >
                        <FaTruck />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingItem(item);
                          setConfirmOpen(true);
                        }}
                        className="text-Red "
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      {modalOpen && (
        <EditTableItemModal
          handleSave={handleSave}
          setModalOpen={setModalOpen}
          form={form}
          setForm={setForm}
          saving={false}
        />
      )}

      {confirmOpen && (
        <DeleteModal
          deletingItem={deletingItem}
          setConfirmOpen={setConfirmOpen}
          handleDelete={() => handleDeleteItem(deletingItem.id)}
          deleting={deleting}
        />
      )}

      {buyOpen && (
        <BuySuppliesModal
          buyingItem={buyingItem}
          setConfirmOpen={setBuyOpen}
          handleBuy={handleBuy}
          buying={buying}
          form={buyForm}
          setForm={setBuyForm}
        />
      )}
    </div>
  );
};

export default ItemTable;
