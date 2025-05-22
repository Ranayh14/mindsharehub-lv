import React, { useState } from 'react';
import { Head, Link }   from '@inertiajs/react';
import { route }        from 'ziggy-js';
import { Ziggy }        from '@/ziggy';

export default function AdminDashboard() {
  return (
    <>
      <Head title="Admin Dashboard" />
      <DashboardLayout title="Selamat Datang di Dashboard Admin" bg="bg-gray-200" />
    </>
  );
}

function DashboardLayout({ title, bg }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${bg} min-h-screen flex flex-col`}>
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white">
        <h1 className="text-xl font-semibold text-[#2B1B54]">MindshareHub – Admin</h1>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            ☰
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50">
              <Link
                href={route('logout', {}, false, Ziggy)}
                method="post"
                as="button"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      </main>
    </div>
  );
}
