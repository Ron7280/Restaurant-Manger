import React from "react";
import { MdDelete } from "react-icons/md";

const ItemTable = ({ filteredItems, quantityFilter, comparisonType }) => {
  const applyFilter = (itemQuantity) => {
    switch (comparisonType) {
      case ">":
        return parseFloat(itemQuantity) > quantityFilter;
      case "<":
        return parseFloat(itemQuantity) < quantityFilter;
      case "=":
        return parseFloat(itemQuantity) === quantityFilter;
      default:
        return false;
    }
  };

  return (
    <div className="overflow-x-auto bg-white text-black font-semibold rounded-lg shadow-md">
      <table className="w-full table-auto ">
        <thead className="bg-mainColor text-white">
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">Item</th>
            <th className="p-2">Category</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No items found.
              </td>
            </tr>
          ) : (
            filteredItems
              .filter((item) => applyFilter(item.quantity))
              .map((item) => (
                <tr key={item.id} className="border-b text-center">
                  <td className="p-2">{item.imageUrl}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td
                    className={`p-2 ${
                      item.quantity <= quantityFilter ? "text-Red" : ""
                    }`}
                  >
                    {item.quantity}
                  </td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2 flex justify-center gap-3">
                    <button
                      onClick={() => alert("Edit item functionality")}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => alert("Delete item functionality")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
