import React, { useState } from 'react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import EditCommentModal from './Modal/EditCommentModal';
import ConfirmDeleteModal from './Modal/ConfirmDeleteModal';

export default function CommentCard({ comment, onCommentUpdate }) {
  const { auth } = usePage().props;
  const currentUser = auth.user;
  const isOwner = currentUser.id === comment.user.id;

  const [localComment, setLocalComment] = useState(comment);
  const [showActions, setShowActions] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleLike = async () => {
    try {
      const res = await axios.post(route('comments.like', { comment: localComment.id }, false, Ziggy));
      
      setLocalComment(prev => ({
        ...prev,
        is_liked: res.data.status === 'liked',
        likes_count: res.data.likes_count
      }));
      
      if (onCommentUpdate) {
        onCommentUpdate(localComment.id, {
          is_liked: res.data.status === 'liked',
          likes_count: res.data.likes_count
        });
      }
    } catch (err) {
      console.error('Gagal like komentar:', err.response);
    }
  };

  const handleDelete = () => {
    Inertia.delete(route('comments.destroy', { comment: localComment.id }, false, Ziggy), {
      onSuccess: () => {
        if (onCommentUpdate) {
          onCommentUpdate(localComment.id, null); // null indicates deletion
        }
      }
    });
  };

  const handleEdit = async (newContent) => {
    try {
      const response = await axios.put(
        route('comments.update', { comment: localComment.id }, false, Ziggy),
        { comment: newContent }
      );

      setLocalComment(prev => ({
        ...prev,
        comment: response.data.comment
      }));

      if (onCommentUpdate) {
        onCommentUpdate(localComment.id, { comment: response.data.comment });
      }

      setEditModalOpen(false);
    } catch (err) {
      console.error('Gagal edit komentar:', err.response);
    }
  };

  const handleReport = async () => {
    try {
      await axios.post(route('reports.store', {}, false, Ziggy), {
        comment_id: localComment.id,
        reason: 'inappropriate',
        description: 'Komentar tidak pantas'
      });
      alert('Komentar telah dilaporkan');
      setShowActions(false);
    } catch (err) {
      console.error('Gagal melaporkan komentar:', err.response);
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={localComment.user.profile_picture ? `/images/${localComment.user.profile_picture}` : '/images/default.png'}
            className="w-8 h-8 rounded-full object-cover"
            alt="User"
          />
          <div>
            <p className="font-semibold text-sm">{localComment.user.username}</p>
            <p className="text-xs text-gray-400">{localComment.created_at_human}</p>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowActions(!showActions)} className="text-xl px-2 hover:text-purple-400">
            ⋯
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 bg-gray-800 text-sm rounded shadow p-2 space-y-2 z-50 w-36">
              {isOwner ? (
                <>
                  <button onClick={() => setEditModalOpen(true)} className="w-full text-left hover:bg-purple-600 hover:text-white p-2 rounded transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteModalOpen(true)} className="w-full text-left hover:bg-red-600 hover:text-white p-2 rounded transition-colors">
                    Hapus
                  </button>
                  <button onClick={() => setShowActions(false)} className="w-full text-left hover:bg-gray-600 p-2 rounded transition-colors">
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleReport} className="w-full text-left hover:bg-orange-600 hover:text-white p-2 rounded transition-colors">
                    Laporkan
                  </button>
                  <button onClick={() => setShowActions(false)} className="w-full text-left hover:bg-gray-600 p-2 rounded transition-colors">
                    Batal
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm mt-2">{localComment.comment}</p>

      <div className="flex items-center gap-4 mt-3 text-sm">
        <button onClick={handleLike} className="flex items-center gap-2 text-white hover:text-red-400">
          {localComment.is_liked ? '❤️' : '🤍'} {localComment.likes_count} Likes
        </button>
      </div>

      {/* Modals */}
      <EditCommentModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        comment={localComment}
        onEdit={handleEdit}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        message="Anda yakin ingin menghapus komentar ini?"
      />
    </div>
  );
} 