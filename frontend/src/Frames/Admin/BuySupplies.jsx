import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { HiBuildingStorefront } from "react-icons/hi2";
import { API } from "../../API_URL";
import ExportToExcel from "../../Components/ExportToExcel";

const BuySupplies = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPurchases = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/supplies/all_supply_purchase`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPurchases(data.purchases);
      } else {
        alert("Failed to fetch supply purchases");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching supply purchases");
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPurchases = purchases.filter((p) =>
    p.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={HiBuildingStorefront}
        title="Buy Supplies"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        btnFunction={() => {}}
        button={true}
      />
      <div className="overflow-x-auto h-[95%]">
        <table className="min-w-full font-semibold text-black bg-white rounded-lg table-auto">
          <thead className="bg-mainColor text-white">
            <tr>
              <th className="p-2 w-[5%] text-left">Image</th>
              <th className="p-2 w-[17%] text-left">Item Name</th>
              <th className="p-2 w-[10%] text-left">Quantity</th>
              <th className="p-2 w-[3%] text-left">Unit</th>
              <th className="p-2 w-[10%] text-left">Status</th>
              <th className="p-2 w-[10%] text-left">Ordered By</th>
              <th className="p-2 w-[15%] text-left">Buyer</th>
              <th className="p-2 w-[15%] text-left">Created At</th>
              <th className="p-2 w-[15%] text-left">
                <div className="flex items-center justify-center gap-5 w-full">
                  Updated At
                  <ExportToExcel
                    data={filteredPurchases}
                    fileName="Purchases"
                    sheetName="Purchases"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-2">
                  No supply purchases found.
                </td>
              </tr>
            ) : (
              filteredPurchases.map((p, index) => (
                <tr
                  key={p.id}
                  className={` ${index % 2 == 0 ? "bg-green-100" : ""}`}
                >
                  <td className="p-2">
                    {p.imageUrl ? (
                      <img
                        src={`${API}${p.imageUrl}`}
                        alt={p.item_name}
                        className="h-8 w-8 rounded-md"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2">{p.item_name}</td>
                  <td className="p-2">{p.quantity}</td>
                  <td className="p-2">{p.unit || "-"}</td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2">{p.orderedBy?.name || "-"}</td>
                  <td className="p-2">{p.buyer?.name || "-"}</td>
                  <td className="p-2">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {p.updated_at
                      ? new Date(p.updated_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuySupplies;
