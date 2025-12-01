import React, { useMemo } from "react";
import { FaImages } from "react-icons/fa";
import AnimatedButton from "../Components/AnimatedButton";
import { IoIosSave } from "react-icons/io";

const EditMenuModal = ({
  handleSave,
  editingItem,
  setModalOpen,
  form,
  setForm,
  saving,
}) => {
  const fields = useMemo(
    () => [
      {
        id: 1,
        title: "Name",
        type: "input",
        value: form.name,
        onChange: (e) => setForm((s) => ({ ...s, name: e.target.value })),
      },
      {
        id: 2,
        title: "Description",
        type: "textarea",
        value: form.description,
        onChange: (e) =>
          setForm((s) => ({ ...s, description: e.target.value })),
      },
      {
        id: 3,
        title: "Price (USD)",
        type: "input",
        isNumber: true,
        value: form.price,
        onChange: (e) => setForm((s) => ({ ...s, price: e.target.value })),
      },
      {
        id: 4,
        title: "Category",
        type: "input",
        isNumber: false,
        value: form.category,
        onChange: (e) => setForm((s) => ({ ...s, category: e.target.value })),
      },
    ],
    [form, setForm]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white text-black rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">
            {editingItem ? "Edit Item" : "Create Item"}
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fields.map((f) => (
            <div key={f.id} className="flex flex-col gap-1">
              <div className="font-semibold text-slate-700">{f.title}</div>

              {f.type === "textarea" ? (
                <textarea
                  value={f.value}
                  onChange={f.onChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <input
                  type={f.isNumber ? "number" : "text"}
                  step={f.isNumber ? "0.01" : undefined}
                  value={f.value}
                  onChange={f.onChange}
                  className="w-full p-2 border rounded-md"
                />
              )}
            </div>
          ))}

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
              className=" bg-gray-500 p-1 w-[15%] shadow-md shadow-black text-white font-semibold rounded-md"
            >
              Cancel
            </button>

            <AnimatedButton
              func={handleSave}
              color="bg-green-600"
              icon={IoIosSave}
              size={25}
              text={
                saving
                  ? "Saving..."
                  : editingItem
                  ? "Save changes"
                  : "Create item"
              }
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

export default EditMenuModal;
