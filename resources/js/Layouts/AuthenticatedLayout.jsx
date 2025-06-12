import React from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import Carousel from './Carousel';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#1a1b26] text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 px-4 py-6 overflow-auto">
        {children}
      </main>

      <RightSidebar />
    </div>
  );
}
