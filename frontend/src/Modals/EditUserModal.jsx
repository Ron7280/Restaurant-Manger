import React, { useMemo, useState } from "react";
import { FaImages } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import AnimatedButton from "../Components/AnimatedButton";

const EditUserModal = ({ handleSave, setModalOpen, form, setForm, saving }) => {
  const [isBanned, setIsBanned] = useState(form.banned);

  const fields = useMemo(
    () => [
      {
        title: "User Full Name",
        type: "text",
        value: form.name,
        func: (e) => setForm((s) => ({ ...s, name: e.target.value })),
      },
      {
        title: "Role",
        type: "text",
        value: form.role,
        func: (e) => setForm((s) => ({ ...s, role: e.target.value })),
      },
      {
        title: "Username",
        type: "text",
        value: form.username,
        func: (e) => setForm((s) => ({ ...s, username: e.target.value })),
      },
    ],
    [form, setForm]
  );

  const toggleBannedStatus = () => {
    setIsBanned((prev) => !prev);
    setForm((s) => ({ ...s, banned: !s.banned }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white text-black rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Edit Item</div>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fields.map((f, index) => {
            return (
              <div key={index} className="flex flex-col gap-1">
                <div className="font-semibold text-slate-700">{f.title}</div>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={f.func}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            );
          })}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isBanned}
              onChange={toggleBannedStatus}
              className="w-4 h-4"
            />
            <div className="font-semibold text-slate-700">Banned</div>
          </div>

          <div>
            <div className="font-semibold text-slate-700 mb-1">Image</div>
            <label className="cursor-pointer flex items-center gap-2 p-2 border rounded-md">
              <div className="flex items-center gap-3">
                <FaImages size={20} /> Upload Image
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm((s) => ({
                      ...s,
                      imageFile: file,
                      imageUrl: URL.createObjectURL(file),
                      imagePreview: URL.createObjectURL(file),
                    }));
                  }
                }}
              />
            </label>

            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="preview"
                className="w-32 h-32 mt-3 object-cover rounded-md shadow"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-gray-500 p-1 w-[15%] shadow-md shadow-black text-white font-semibold rounded-md"
            >
              Cancel
            </button>

            <AnimatedButton
              func={() => handleSave(form)}
              color="bg-green-600"
              icon={IoIosSave}
              size={25}
              text={saving ? "Saving..." : "Save Item"}
              w1="10%"
              w2="40%"
              pad="p-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
