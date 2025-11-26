import React, { useEffect, useState, useMemo } from "react";
import { FaDollarSign } from "react-icons/fa";
import { API } from "../../API_URL";
import { FaSearch } from "react-icons/fa";
import ViewMenuCompo from "../../Components/ViewMenuCompo";
import { useNavigate } from "react-router-dom";

const ViewMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [budget, setBudget] = useState("");
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/menu`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddToOrder = (item) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((i) => i.id === item.id);

      if (existingItem) {
        // increase qty
        return prevOrder.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      // add new item with qty = 1
      return [...prevOrder, { ...item, qty: 1 }];
    });
  };

  const categories = useMemo(() => {
    const cats = menuItems.map((item) => item.category).filter(Boolean);
    return ["all", ...new Set(cats)];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      const matchesBudget = !budget || item.price <= parseFloat(budget);

      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [menuItems, search, category, budget]);

  if (loading) return <div className="p-4 text-center">Loading menu...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="p-2 w-full flex flex-col gap-2">
      <div className="flex items-center h-[6%] justify-center w-full gap-3">
        <div className="flex justify-between w-[50%] rounded-lg bg-white items-center pl-2 pr-2 shadow-md shadow-black">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu . . ."
            className="w-full bg-transparent outline-none text-black font-semibold p-2"
          />
          <FaSearch className="text-emerald-400" />
        </div>

        <div className="flex justify-between w-[13%] rounded-lg bg-white items-center pl-2 pr-2 shadow-md shadow-black">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Your budget . . ."
            className="w-full bg-transparent outline-none text-black p-2"
          />
          <FaDollarSign className="text-emerald-400" />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 w-[10%] border text-black rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {order.length > 0 && (
          <button
            className="bg-mainColor w-[10%] p-1 rounded-lg shadow-black shadow-md font-semibold"
            onClick={() => navigate("/menu/orderPage", { state: { order } })}
          >
            View Order
          </button>
        )}
      </div>

      <div
        className="grid grid-cols-5 gap-3 pr-1 overflow-y-auto h-[94%] scrollbar-thin
       scrollbar-thumb-mainColor scrollbar-track-transparent"
      >
        {filteredItems.map((item, index) => (
          <ViewMenuCompo item={item} onAddToOrder={handleAddToOrder} />
        ))}
      </div>
    </div>
  );
};

export default ViewMenu;
