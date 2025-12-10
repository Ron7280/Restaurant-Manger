import React, { useEffect, useState, useMemo } from "react";
import { FaDollarSign, FaUtensils } from "react-icons/fa";
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
  const token = localStorage.getItem("token");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/menu/fetch_menu`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
        return prevOrder.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

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
    <div className="p-3 pb-0 w-full h-full flex flex-col gap-3">
      <div className="flex justify-between h-[5%] w-full">
        <div className="w-[35%] h-full">
          <div
            className="flex items-center gap-3 text-2xl font-semibold bg-gradient-to-r
            from-mainColor via-Indigo to-Indigo bg-clip-text text-transparent"
          >
            <FaUtensils size={40} className="text-mainColor" />
            Menu
          </div>
        </div>
        <div className="flex items-center h-full justify-end w-full gap-3">
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
            className="p-2 w-[10%] border text-gray-600 outline-none rounded-md"
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
      </div>

      <div className="grid grid-cols-4 gap-4 h-[95%] overflow-y-auto scrollbar-none">
        {filteredItems.map((item, index) => (
          <ViewMenuCompo
            key={index}
            item={item}
            onAddToOrder={handleAddToOrder}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewMenu;
