import React, { useMemo } from "react";
import { FaImages } from "react-icons/fa";
import { IoIosCart } from "react-icons/io";
import AnimatedButton from "../Components/AnimatedButton";
import { API } from "../API_URL";

const BuySuppliesModal = ({
  buyingItem,
  setConfirmOpen,
  handleBuy,
  buying,
  form,
  setForm,
}) => {
  const fields = useMemo(
    () => [
      {
        title: "Item Name",
        type: "text",
        value: buyingItem?.name || "",
        readOnly: true,
      },
      {
        title: "Current Quantity",
        type: "text",
        value: buyingItem?.quantity || "",
        readOnly: true,
      },
      {
        title: "Unit",
        type: "text",
        value: buyingItem?.unit || "",
        readOnly: true,
      },
      {
        title: "Category",
        type: "text",
        value: buyingItem?.category || "",
        readOnly: true,
      },
      {
        title: "Quantity to Buy",
        type: "number",
        value: form.buyQuantity,
        readOnly: false,
        func: (e) => setForm((s) => ({ ...s, buyQuantity: e.target.value })),
      },
    ],
    [buyingItem, form, setForm]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white text-black rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Buy Supplies</div>
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="font-semibold text-slate-700">{f.title}</div>
              <input
                type={f.type}
                value={f.value}
                onChange={f.func}
                readOnly={f.readOnly}
                className={`w-full p-2 border rounded-md ${
                  f.readOnly ? "bg-gray-100" : ""
                }`}
              />
            </div>
          ))}

          <div className="mt-2">
            <div className="font-semibold text-slate-700 mb-1">Item Image</div>
            {buyingItem?.imageUrl ? (
              <img
                src={`${API}${buyingItem.imageUrl}`}
                alt="item"
                className="w-32 h-32 object-cover rounded-md shadow"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md shadow">
                <FaImages size={22} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="bg-gray-500 p-1 w-[20%] shadow-md shadow-black text-white font-semibold rounded-md"
            >
              Cancel
            </button>

            <AnimatedButton
              func={handleBuy}
              color="bg-blue-600"
              icon={IoIosCart}
              size={25}
              text={buying ? "Processing..." : "Buy"}
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

export default BuySuppliesModal;
