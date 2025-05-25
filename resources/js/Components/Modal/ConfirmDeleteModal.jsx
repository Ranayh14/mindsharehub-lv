import React from 'react';

export default function ConfirmDeleteModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">Konfirmasi</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
