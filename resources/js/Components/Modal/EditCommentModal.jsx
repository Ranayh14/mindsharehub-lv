import React from 'react';
import { useForm } from '@inertiajs/react';
import { route }  from 'ziggy-js';
import { Ziggy }  from '@/ziggy';
import DialogWrapper from './DialogWrapper';

export default function EditCommentModal({ open, onClose, comment }) {
  // comment = { id, text }
  const { data, setData, put, processing, reset } = useForm({
    comment: comment?.text || '',
  });

  React.useEffect(() => setData('comment', comment?.text || ''), [comment]);

  function submit(e) {
    e.preventDefault();
    put(route('comments.update', { comment: comment.id }, false, Ziggy), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <DialogWrapper open={open} onClose={onClose} title="Edit Komentar">
      <form onSubmit={submit} className="space-y-4">
        <textarea
          required
          rows="4"
          value={data.comment}
          onChange={e => setData('comment', e.target.value)}
          className="w-full border rounded p-2 resize-none"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-sm rounded">
            Batal
          </button>
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
          >
            Simpan
          </button>
        </div>
      </form>
    </DialogWrapper>
  );
}
