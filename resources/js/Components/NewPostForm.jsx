import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import { Inertia } from '@inertiajs/inertia';

export default function NewPostForm({ currentUser }) {
  const { data, setData, post, processing, reset } = useForm({
    content: '',
    image: null,
  });

  const handleSubmit = e => {
    e.preventDefault();
    post((route('posts.store', {}, false, Ziggy)), {
      forceFormData: true,
      onSuccess: () => {
        reset();
        Inertia.reload({ only: ['posts'] });
      },
    });
  };

  return (
    <div className="bg-[#2B1B54] text-white p-6 rounded-lg mt-6 mb-6">
      <div className="flex items-center mb-4">
        <img
          src={currentUser.profile_picture ? `/images/${currentUser.profile_picture}` : '/images/default.png'}
          alt="Profile Picture"
          className="w-10 h-10 rounded-full object-cover mr-2"
        />
        <h2 className="text-lg font-semibold ml-2">Buat Postingan Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          required
          name="content"
          rows="4"
          className="w-full p-3 text-black border rounded-md resize-none"
          placeholder="Tulis sesuatu..."
          value={data.content}
          onChange={e => setData('content', e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setData('image', e.target.files[0])}
          className="block w-full text-sm border rounded-md"
        />
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white transition"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
