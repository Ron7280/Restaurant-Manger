import { useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import AnimatedButton from "./AnimatedButton";
import { API } from "../API_URL";

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
      className="rounded-xl justify-center  h-40 bg-white shadow-black shadow-md flex flex-col"
    >
      <div className="flex items-center w-full h-full justify-center gap-2">
        <div className="w-[30%] h-full rounded-xl bg-gray-200 overflow-hidden">
          {it.imageUrl ? (
            <img
              src={`${API}${it.imageUrl}`}
              alt={it.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MdImageNotSupported size={40} className="text-gray-600" />
            </div>
          )}
        </div>

        <div className="w-[70%] h-full flex flex-col gap-2 p-2">
          <div className="w-full h-[75%]">
            <div className="flex justify-between items-center w-full h-[30%]">
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
            <div
              className="font-semibold h-[70%] overflow-auto scrollbar-track-transparent 
            scrollbar-thin scrollbar-thumb-transparent text-slate-400"
            >
              {it.description}
            </div>
          </div>

          <div className="flex h-[25%] items-center justify-end gap-2">
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
