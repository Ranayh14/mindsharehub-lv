import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';
import EditPostModal from './Modal/EditPostModal';  // Import EditPostModal
import ReportPostModal from './Modal/ReportPostModal';
import DialogWrapper from './Modal/DialogWrapper';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import { Ziggy } from '@/ziggy';
import ConfirmDeleteModal from './Modal/ConfirmDeleteModal';

export default function PostCard({ post }) {
  const { auth } = usePage().props;
  const currentUser = auth.user;
  const isOwner = currentUser.id === post.user.id;

  const [localPost, setLocalPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [commentFormData, setCommentFormData] = useState(""); // State untuk form komentar
  const [replyingTo, setReplyingTo] = useState(null); // State untuk username yang di-reply
  const [editModalOpen, setEditModalOpen] = useState(false); // State untuk mengontrol modal Edit
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState(null); // Fix: add reportPostId state
  const [showActions, setShowActions] = useState(false);

  const commentForm = useForm({
    post_id: post.id,
    comment: '',
  });

  const handleLike = async () => {
    try {
      const res = await axios.post(route('posts.like', { post: localPost.id }, false, Ziggy));
  
      // Perbarui state localPost dengan data terbaru dari server
      setLocalPost(prev => ({
        ...prev,
        is_liked: res.data.status === 'liked', // Update status like
        likes_count: res.data.likes_count, // Update likes count
        total_comments: res.data.total_comments // Update jumlah komentar
      }));
  
      // Reload data secara realtime tanpa perlu refresh halaman
      Inertia.reload({
        only: ['posts'], // Reload hanya bagian posts yang ter-reload
      });
  
    } catch (err) {
      console.error('Gagal like:', err.response);
    }
  };
  

  const submitComment = e => {
    e.preventDefault();
    commentForm.post(route('comments.store', {}, false, Ziggy), {
      preserveScroll: true,
      onSuccess: () => {
        commentForm.reset();
        setReplyingTo(null); // Reset setelah komentar dikirim
        Inertia.replace(route('dashboard')); // Pindahkan kembali ke /dashboard
      }
    });
  };

  const handleCommentLike = async (commentId) => {
    try {
      const res = await axios.post(route('comments.like', { comment: commentId }, false, Ziggy));
      setLocalPost(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId ? { ...comment, is_liked: res.data.status === 'liked', likes_count: res.data.likes_count } : comment
        )
      }));
    } catch (err) {
      console.error('Gagal like komentar:', err.response);
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      const res = await axios.post(route('comments.report', { comment: commentId }, false, Ziggy));
      setLocalPost(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId ? { ...comment, is_reported: true } : comment
        )
      }));
    } catch (err) {
      console.error('Gagal report komentar:', err.response);
    }
  };

  const handleReplyComment = (commentId, username) => {
    // Ketika user klik reply, tambahkan username yang di-reply ke dalam form
    setReplyingTo(username);
    setCommentFormData(`@${username} `); // Menambahkan username pada form comment
  };

  const handleDelete = () => {
    Inertia.delete(route('posts.destroy', { post: localPost.id }, false, Ziggy), {
      onSuccess: () => {
        setLocalPost(null);  // Menghapus post dari UI
        Inertia.replace(route('dashboard')); // Kembali ke dashboard setelah menghapus
      }
    });
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(route('posts.update', { post: localPost.id }, false, Ziggy), {
        content: localPost.content
      });

      // Update konten langsung di UI
      setLocalPost(prev => ({
        ...prev,
        content: response.data.content, // Update konten secara langsung
        is_liked: response.data.is_liked,  // Pastikan data lainnya yang diupdate juga ter-refresh
        likes_count: response.data.likes_count,
        total_comments: response.data.total_comments,
      }));
      setEditModalOpen(false);  // Tutup modal setelah sukses
    } catch (err) {
      console.error('Gagal edit postingan:', err.response);
    }
  };

  const handleReport = (postId) => {
    setReportPostId(postId);
    setReportModalOpen(true);
  };

  return (
    <div className="bg-[#2B1B54] text-white p-6 rounded-lg mt-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.user.profile_picture ? `/images/${post.user.profile_picture}` : '/images/default.png'}
            className="w-10 h-10 rounded-full object-cover"
            alt="User"
          />
          <div>
            <p className="font-semibold">{post.user.username}</p>
            <p className="text-xs text-gray-400">{post.created_at_human}</p>
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
                  <button onClick={() => setReportModalOpen(true)} className="w-full text-left hover:bg-orange-600 hover:text-white p-2 rounded transition-colors">
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

      <p className="mb-3">{localPost.content}</p>
      {localPost.image_path && (
        <img src={`/images/${localPost.image_path}`} alt="Post" className="rounded mb-3 max-h-80 object-cover w-full" />
      )}

      <div className="flex items-center gap-4 text-sm">
        <button onClick={handleLike}>
          {localPost.is_liked ? '❤️' : '🤍'} {localPost.likes_count} Likes
        </button>
        <button onClick={() => setShowComments(prev => !prev)}>
          💬 {localPost.total_comments} Komentar
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3">
          {post.comments.map(c => (
            <div key={c.id} className="bg-gray-700 p-4 rounded">
              <strong className="text-sm">{c.user.username}:</strong>
              <p className="text-sm mt-1">{c.comment}</p>

              <div className="flex gap-4 mt-3 text-sm">
                <button onClick={() => handleCommentLike(c.id)} className="flex items-center gap-2 text-white hover:text-red-400">
                  {c.is_liked ? '❤️' : '🤍'} {c.total_likes} Likes
                </button>

                <button onClick={() => handleReportComment(c.id)} className="text-red-500 hover:text-red-400">
                  Laporkan
                </button>

                <button onClick={() => handleReplyComment(c.id, c.user.username)} className="text-blue-500 hover:text-blue-400">
                  Balas
                </button>
              </div>

              {/* Balasan untuk setiap komentar */}
              {c.replies && c.replies.length > 0 && (
                <div className="mt-4 pl-5 border-l-2 border-gray-600 space-y-3">
                  {c.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-600 p-3 rounded">
                      <strong>{reply.user.username}:</strong> {reply.comment}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Form komentar yang sudah diisi dengan username untuk balasan */}
          <form onSubmit={submitComment} className="flex flex-col gap-2 mt-3">
            {replyingTo && (
              <p className="text-sm text-gray-300">Balas ke: @{replyingTo}</p>
            )}
            <textarea
              required
              className="p-2 rounded text-black"
              rows={2}
              placeholder="Tulis komentar..."
              value={commentFormData}
              onChange={(e) => {
                setCommentFormData(e.target.value);
                commentForm.setData('comment', e.target.value); // Update form data
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded w-fit self-end"
              disabled={commentForm.processing}
            >
              Kirim
            </button>
          </form>
        </div>
      )}

      {/* Modals */}
      <EditPostModal open={editModalOpen} onClose={() => setEditModalOpen(false)} post={localPost} onEdit={handleEdit} />
      <ReportPostModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} postId={reportPostId} content={localPost.content} />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        message="Anda yakin ingin menghapus postingan ini?"
      />
    </div>
  );
}
