import React from 'react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { Head } from '@inertiajs/react';

export default function AdminLayout({ children, user }) {
    const { darkMode } = useDarkMode();

    return (
        <div className={`min-h-screen flex ${darkMode ? 'bg-[#202225]' : 'bg-gray-50'}`}>
            <AdminSidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
