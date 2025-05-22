import React from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import PostCard from '@/Components/PostCard';
import NewPostForm from '@/Components/NewPostForm'; // Import NewPostForm

export default function UserDashboard() {
  const { posts, auth } = usePage().props;
  const currentUser = auth.user;

  return (
    <DashboardLayout>
      <Head title="Dashboard" />

      <NewPostForm currentUser={currentUser} /> {/* Menampilkan form buat postingan */}

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
