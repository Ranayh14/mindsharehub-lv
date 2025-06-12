import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { route }  from 'ziggy-js';
import { Ziggy }  from '@/ziggy';
import DialogWrapper from './DialogWrapper';
import Toast from '../Toast';

export default function ReportPostModal({ open, onClose, postId, content }) {
  const [showToast, setShowToast] = useState(false);
  const { data, setData, post, processing, reset, wasSuccessful } = useForm({
    post_id: postId,
    reason: '',
    description: '',
  });

  React.useEffect(() => setData('post_id', postId), [postId]); // sync ketika post berganti

  React.useEffect(() => {
    if (wasSuccessful) {
      setShowToast(true);
      reset();
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [wasSuccessful]);

  function submit(e) {
    e.preventDefault();
    post(route('reports.store'));
  }

  return (
    <>
      <DialogWrapper open={open} onClose={onClose} title="Laporkan Postingan">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">{content}</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <select
                required
                value={data.reason}
                onChange={e => setData('reason', e.target.value)}
                className="w-full border rounded p-2 text-gray-700"
              >
                <option value="">Pilih alasan</option>
                <option value="spam">Spam</option>
                <option value="harassment">Pelecehan</option>
                <option value="offensive">Konten Menyinggung</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <textarea
                required
                rows="3"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                className="w-full border rounded p-2 resize-none text-gray-700"
                placeholder="Deskripsi singkat…"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                Kirim Laporan
              </button>
            </div>
          </form>
        </div>
      </DialogWrapper>

      <Toast 
        show={showToast}
        message="Laporan berhasil dikirim"
        type="success"
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
