import { useEffect, useState } from "react";
import { FaUtensils } from "react-icons/fa";
import { API } from "../../API_URL";
import ManageMenuCompo from "../../Components/ManageMenuCompo";
import Loader from "../../Components/Loader";
import EditMenuModal from "../../Modals/EditMenuModal";
import DeleteModal from "../../Modals/DeleteModal";
import Header from "../../Components/Header";

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

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description?.trim() || "");
    formData.append("price", parseFloat(form.price));
    formData.append("category", form.category?.trim() || "");

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      setSaving(true);
      setError(null);

      let res;
      if (editingItem) {
        formData.append("id", editingItem.id);
        res = await fetch(`${API}/menu/update_menu`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        res = await fetch(`${API}/menu/save_new`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      const data = await res.json();
      setForm((prevForm) => ({
        ...prevForm,
        imageUrl: data.imageUrl,
      }));

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
    <div className="p-3 pb-0 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaUtensils}
        title="Manage Menu"
        searchQuery={search}
        handleSearchChange={(e) => setSearch(e.target.value)}
        btnFunction={openCreate}
        button={true}
        searchBTN={true}
        excelBtn={true}
        Excel_Data={filtered}
        Excel_text={"Menu"}
      />

      {loading && (
        <div className=" flex items-center justify-center w-full h-[95%]">
          <Loader type="dots" color="#10b981" />
        </div>
      )}

      {error && (
        <div className=" flex items-center justify-center w-full h-[95%] text-Red text-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 h-[95%] overflow-y-auto scrollbar-none">
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
