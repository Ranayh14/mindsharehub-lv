import React from 'react';
import { useForm } from '@inertiajs/react';
import { route }  from 'ziggy-js';
import { Ziggy }  from '@/ziggy';
import DialogWrapper from './DialogWrapper';

export default function ReportPostModal({ open, onClose, postId, content }) {
  const { data, setData, post, processing, reset } = useForm({
    post_id: postId,
    reason: '',
    description: '',
  });

  React.useEffect(() => setData('post_id', postId), [postId]); // sync ketika post berganti

  function submit(e) {
    e.preventDefault();
    post(route('reports.store', {}, false, Ziggy), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <DialogWrapper open={open} onClose={onClose} title="Laporkan Postingan">
      <p className="text-sm mb-4 bg-gray-100 p-2 rounded">{content}</p>
      <form onSubmit={submit} className="space-y-4">
        <select
          required
          value={data.reason}
          onChange={e => setData('reason', e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Pilih alasan</option>
          <option>Spam</option>
          <option>Pelecehan</option>
          <option>Konten Menyinggung</option>
          <option>Lainnya</option>
        </select>

        <textarea
          required
          rows="3"
          value={data.description}
          onChange={e => setData('description', e.target.value)}
          className="w-full border rounded p-2 resize-none"
          placeholder="Deskripsi singkat…"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded bg-gray-200">
            Batal
          </button>
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white"
          >
            Kirim Laporan
          </button>
        </div>
      </form>
    </DialogWrapper>
  );
}
