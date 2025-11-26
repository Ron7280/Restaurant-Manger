import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaUtensils } from "react-icons/fa";
import { API } from "../../API_URL";
import ManageMenuCompo from "../../Components/ManageMenuCompo";
import Loader from "../../Components/Loader";
import EditMenuModal from "../../Modals/EditMenuModal";
import DeleteModal from "../../Modals/DeleteModal";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
};

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/menu/fetch_menu`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to load menu: ${res.status}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price != null ? String(item.price) : "",
      imageUrl: item.imageUrl || "",
      category: item.category || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) {
      alert("Please provide name and price");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      price: parseFloat(form.price),
      imageUrl: form.imageUrl?.trim() || null,
      category: form.category?.trim(),
    };

    try {
      setSaving(true);
      setError(null);

      let res;
      if (editingItem) {
        res = await fetch(`${API}/menu/update_menu`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ payload, id: editingItem.id }),
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      } else {
        res = await fetch(`${API}/menu/save_new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      }

      // refresh list after successful operation
      await fetchItems();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item) => {
    setDeletingItem(item);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API}/menu/delete_menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: deletingItem.id }),
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      await fetchItems();
      setConfirmOpen(false);
      setDeletingItem(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = items.filter((it) =>
    `${it.name} ${it.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="w-[50%]">
          <div className="flex items-center gap-3 text-2xl  font-semibold text-mainColor">
            <FaUtensils size={40} /> Manage Menu
          </div>
        </div>

        <div className="flex items-center justify-end w-[50%] gap-3">
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

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-mainColor text-white
              rounded-lg shadow-md shadow-black p-2"
          >
            <FaPlus /> New Item
          </button>
        </div>
      </div>

      {loading && (
        <div className=" flex items-center justify-center w-full h-full">
          <Loader type="dots" color="#10b981" />
        </div>
      )}

      {error && (
        <div className=" flex items-center justify-center w-full h-full text-Red text-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((it, index) => (
          <ManageMenuCompo
            key={index}
            it={it}
            openEdit={openEdit}
            confirmDelete={confirmDelete}
          />
        ))}
      </div>

      {modalOpen && (
        <EditMenuModal
          handleSave={handleSave}
          editingItem={editingItem}
          setModalOpen={setModalOpen}
          form={form}
          setForm={setForm}
          saving={saving}
        />
      )}

      {confirmOpen && (
        <DeleteModal
          deletingItem={deletingItem}
          setConfirmOpen={setConfirmOpen}
          handleDelete={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
};

export default ManageMenu;
