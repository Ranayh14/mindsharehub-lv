import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { route }  from 'ziggy-js';
import { Ziggy }  from '@/ziggy';
import DialogWrapper from './DialogWrapper';

export default function EditCommentModal({ open, onClose, comment, onEdit }) {
  const [content, setContent] = useState(comment.comment);

  const handleSubmit = () => {
    onEdit(content);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">Edit Komentar</h3>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
