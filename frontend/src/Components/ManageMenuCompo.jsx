import { useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import AnimatedButton from "./AnimatedButton";

const ManageMenuCompo = ({ it, openEdit, confirmDelete }) => {
  const buttons = useMemo(
    () => [
      {
        func: () => openEdit(it),
        icon: FaEdit,
        text: "Edit",
        color: "bg-blue-400",
      },
      {
        func: () => confirmDelete(it),
        icon: FaTrash,
        text: "Delete",
        color: "bg-Red",
      },
    ],
    [it, openEdit, confirmDelete]
  );

  return (
    <div
      key={it.id}
      className="rounded-xl justify-center bg-white shadow-black shadow-md border-2 hover:border-mainColor p-2 flex flex-col"
    >
      <div className="flex items-center justify-center gap-4">
        <div className="w-[20%] h-24  rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
          {it.imageUrl ? (
            <img
              src={it.imageUrl}
              alt={it.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MdImageNotSupported size={40} className="text-gray-600" />
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="w-full">
              <div className="flex justify-between items-center w-full">
                <div className="font-semibold text-xl text-slate-800">
                  {it.name}
                </div>
                <div
                  className="text-lg font-bold text-white w-[20%] text-center
                 bg-mainColor rounded-lg"
                >
                  ${Number(it.price).toFixed(2)}
                </div>
              </div>
              <div className="font-semibold text-slate-400">
                {it.description}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {buttons.map((btn, index) => {
              return (
                <AnimatedButton
                  func={btn.func}
                  color={btn.color}
                  icon={btn.icon}
                  size={20}
                  text={btn.text}
                  w1="10%"
                  w2="35%"
                  pad="p-1"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMenuCompo;
