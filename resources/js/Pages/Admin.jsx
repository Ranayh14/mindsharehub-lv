import React from 'react';
import { Head } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '@/Contexts/DarkModeContext';

export default function Admin() {
    const { darkMode } = useDarkMode();

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#202225]' : 'bg-gray-100'}`}>
            <Head title="Admin Dashboard" />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className={`text-2xl font-semibold mb-6 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Dashboard Admin
                        </h1>

                        {/* Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className={`rounded-lg shadow p-6 ${
                                darkMode ? 'bg-[#2f3136] text-white' : 'bg-white'
                            }`}>
                                <h2 className="text-lg font-medium mb-4">Pengguna</h2>
                                <p className="text-3xl font-bold text-indigo-600">0</p>
                                <p className={`text-sm mt-2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>Total pengguna terdaftar</p>
                            </div>

                            {/* Card 2 */}
                            <div className={`rounded-lg shadow p-6 ${
                                darkMode ? 'bg-[#2f3136] text-white' : 'bg-white'
                            }`}>
                                <h2 className="text-lg font-medium mb-4">Postingan</h2>
                                <p className="text-3xl font-bold text-green-600">0</p>
                                <p className={`text-sm mt-2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>Total postingan</p>
                            </div>

                            {/* Card 3 */}
                            <div className={`rounded-lg shadow p-6 ${
                                darkMode ? 'bg-[#2f3136] text-white' : 'bg-white'
                            }`}>
                                <h2 className="text-lg font-medium mb-4">Laporan</h2>
                                <p className="text-3xl font-bold text-red-600">0</p>
                                <p className={`text-sm mt-2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>Laporan yang belum ditangani</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="mt-8">
                            <h2 className={`text-lg font-medium mb-4 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>Aktivitas Terbaru</h2>
                            <div className={`rounded-lg shadow overflow-hidden ${
                                darkMode ? 'bg-[#2f3136]' : 'bg-white'
                            }`}>
                                <div className="p-6">
                                    <p className={`text-center ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>Belum ada aktivitas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
