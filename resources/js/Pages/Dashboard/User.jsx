import React, { useEffect } from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import PostCard from '@/Components/PostCard';
import NewPostForm from '@/Components/NewPostForm';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';

export default function UserDashboard() {
  const { posts, auth } = usePage().props;
  const currentUser = auth?.user;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.visit('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);

      // Set token di header axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Verifikasi token
      axios.get('/api/user')
        .then(response => {
          if (response.data.roles === 'admin') {
            router.visit('/admin/dashboard');
          }
        })
        .catch(() => {
          // Jika token tidak valid, hapus dan redirect ke login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          router.visit('/login');
        });
    } catch (error) {
      console.error('Error in UserDashboard:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      router.visit('/login');
    }
  }, []);

  useAuth();

  if (!currentUser) {
    return null; // atau loading spinner
  }

  return (
    <DashboardLayout>
      <Head title="Dashboard" />

      <NewPostForm currentUser={currentUser} />

      <div className="space-y-6 mt-6">
        {posts.data.length === 0 ? (
          <div className="text-center text-gray-400">Belum ada postingan</div>
        ) : (
          posts.data.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        {posts.links.map((link, i) => (
          <Link
            key={i}
            href={link.url || '#'}
            dangerouslySetInnerHTML={{ __html: link.label }}
            className={`px-3 py-1 mx-1 text-sm rounded ${link.active ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
