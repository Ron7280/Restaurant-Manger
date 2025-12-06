import { useEffect, useMemo, useState } from "react";
import Header from "../../Components/Header";
import { FaEdit, FaUsers } from "react-icons/fa";
import { API } from "../../API_URL";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import DeleteModal from "../../Modals/DeleteModal";
import EditUserModal from "../../Modals/EditUserModal";
import { FaCircleUser } from "react-icons/fa6";
import { TbHandStop } from "react-icons/tb";

const ManageUsers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/users/all_users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    const searchLower = searchQuery.toLowerCase();

    return users.filter((user) => {
      const id = user.id.toLowerCase();
      const name = user.name.toLowerCase();
      const role = user.role.toLowerCase();
      const bannedStatus = user.banned ? "banned" : "active";
      const username = user.username.toLowerCase();

      return (
        id.includes(searchLower) ||
        name.includes(searchLower) ||
        role.includes(searchLower) ||
        bannedStatus.includes(searchLower) | username.includes(searchLower)
      );
    });
  }, [searchQuery, users]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (user) => {
    setForm({ ...user });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.append("id", form.id);
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("banned", form.banned);

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      const res = await fetch(`${API}/users/update_user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);
      fetchUsers();
      setModalOpen(false);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">Loading users...</div>
    );

  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-3 h-full w-full flex flex-col gap-3">
      <Header
        icon={FaUsers}
        title="Manage Users"
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        setModalOpen={setModalOpen}
        button={true}
      />

      <div className="overflow-x-auto h-[95%]">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500">No users found.</div>
        ) : (
          <table className="min-w-full font-semibold text-black bg-white rounded-lg table-auto">
            <thead className="bg-mainColor text-white">
              <tr>
                <th className="p-2 w-[10%] text-left">Image</th>
                <th className="p-2 w-[15%] text-left">Username</th>
                <th className="p-2 w-[20%] text-left">Name</th>
                <th className="p-2 w-[15%] text-left">Role</th>
                <th className="p-2 w-[15%] text-left">Status</th>
                <th className="p-2 w-[15%] text-left">Created At</th>
                <th className="p-2 w-[10%]">
                  <div className="flex items-center justify-center gap-5 w-full">
                    Actions
                    <PiMicrosoftExcelLogoFill
                      onClick={exportToExcel}
                      className="cursor-pointer"
                      size={25}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const createdAt = user.createdAt.split("T")[0];
                return (
                  <tr
                    key={user.id}
                    className={`${index % 2 == 0 ? "bg-green-100" : ""}`}
                  >
                    <td className="p-2">
                      {user.imageUrl ? (
                        <img
                          src={`${API}${user.imageUrl}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : user.banned ? (
                        <TbHandStop className="w-10 h-10 text-Red" />
                      ) : (
                        <FaCircleUser className="w-10 h-10 text-gray-300" />
                      )}
                    </td>
                    <td className="p-2 capitalize">{user.username}</td>
                    <td className="p-2 capitalize">{user.name}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                    <td className="p-2 capitalize">
                      {user.banned ? "Banned" : "Active"}
                    </td>
                    <td className="p-2">{createdAt}</td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-5">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-yellow-600"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingItem(user);
                            setConfirmOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <EditUserModal
          handleSave={handleSave}
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
          handleDelete={() => handleDeleteItem(deletingItem.id)}
          deleting={false}
        />
      )}
    </div>
  );
};

export default ManageUsers;
