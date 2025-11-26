import React from "react";
import AnimatedButton from "../Components/AnimatedButton";
import { AiFillDelete } from "react-icons/ai";

const DeleteModal = ({
  deletingItem,
  setConfirmOpen,
  handleDelete,
  deleting,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white text-black rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-1 text-lg text-Red font-semibold">
          <AiFillDelete size={25} />
          Confirm Delete
        </div>
        <div className="gap-1 font-semibold text-slate-600">
          <div className="flex gap-1 items-center">
            Are you sure you want to delete
            <div className="font-bold text-lg">{deletingItem?.name}</div>?
          </div>
          This action cannot be undone.
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setConfirmOpen(false)}
            className=" bg-gray-500 p-1 w-[15%] shadow-md shadow-black text-white font-semibold rounded-md"
          >
            Cancel
          </button>

          <AnimatedButton
            func={handleDelete}
            color="bg-Red"
            icon={AiFillDelete}
            size={25}
            text={deleting ? "Deleting..." : "Delete"}
            w1="10%"
            w2="40%"
            pad="p-1"
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
