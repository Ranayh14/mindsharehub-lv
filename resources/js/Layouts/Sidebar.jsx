import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';


export default function Sidebar() {
  const { auth } = usePage().props;
  const user = auth.user || {};

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto w-64 bg-[#13141f] flex flex-col justify-between p-5">
      <div>
        <div className="text-xl font-bold mb-8 text-white">MindshareHub</div>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center p-3 text-[#8e8ea0] hover:bg-[#2d2d3d] hover:text-white rounded transition"
          >
            <i className="fi fi-rr-home w-6 h-6 mr-3"></i>
            Home
          </Link>
          <Link
            href="/notifications"
            className="flex items-center p-3 text-[#8e8ea0] hover:bg-[#2d2d3d] hover:text-white rounded transition"
          >
            <i className="fi fi-rr-bell w-6 h-6 mr-3"></i>
            Notifications
          </Link>
          <Link
            href="/diary"
            className="flex items-center p-3 text-[#8e8ea0] hover:bg-[#2d2d3d] hover:text-white rounded transition"
          >
            <i className="fi fi-rr-book w-6 h-6 mr-3"></i>
            Diary
          </Link>
          <Link
            href="/profile"
            className="flex items-center p-3 text-[#8e8ea0] hover:bg-[#2d2d3d] hover:text-white rounded transition"
          >
            <i className="fi fi-rr-user w-6 h-6 mr-3"></i>
            Profile
          </Link>
        </nav>
      </div>
      <div className="flex items-center p-4 bg-purple-700 rounded-full">
        <img
          src={user.profile_picture ? `/images/${user.profile_picture}` : '/images/default.png'}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-white">{user.username}</span>
            <i className="fas fa-heart text-gray-400 ml-2"></i>
          </div>
          <div className="w-full bg-gray-400 rounded-full h-2.5 mt-1">
            <div
              className="bg-red-500 h-2.5 rounded-full"
              style={{ width: `${user.progress_percentage || 0}%` }}
            />
          </div>
        </div>
        <i className="fas fa-ellipsis-h text-gray-400 ml-2"></i>
      </div>
    </aside>
);
}
