import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';  // Import Inertia untuk reload data

export default function EditPostModal({ open, onClose, post }) {
  // State untuk menyimpan konten edit
  const [content, setContent] = useState(post.content);

  // Ambil CSRF token dari halaman
  const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;

  // Fungsi untuk meng-handle submit form edit
  const handleSubmit = () => {
    fetch(`/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,  // Menambahkan CSRF token ke header
      },
      body: JSON.stringify({ content }),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error('Response Error:', text);  // Log HTML response jika bukan JSON
            throw new Error('Network response was not ok');
          });
        }
        return response.json();
      })
      .then(updatedPost => {
        // Menutup modal setelah berhasil update
        onClose();

        // Update konten yang baru di UI (lokal)
        post.content = updatedPost.content;

        // Menggunakan Inertia untuk reload data secara otomatis
        Inertia.reload({
          only: ['posts'],  // Reload hanya bagian posts saja
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  // Jika modal tidak terbuka, jangan tampilkan
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">Edit Postingan</h3>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)} // Mengubah konten state
          className="w-full h-40 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose} // Menutup modal jika cancel
            className="px-6 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit} // Mengirim perubahan saat klik "Simpan"
            className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
