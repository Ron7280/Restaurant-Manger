import React from "react";

const DeleteModal = ({
  deletingItem,
  setConfirmOpen,
  handleDelete,
  deleting,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <div className="text-lg font-semibold">Confirm delete</div>
        <div className="text-sm text-slate-600 mt-2">
          Are you sure you want to delete <div>{deletingItem?.name}</div>? This
          action cannot be undone.
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-4 py-2 rounded-md border"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-md bg-rose-600 text-white shadow"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
