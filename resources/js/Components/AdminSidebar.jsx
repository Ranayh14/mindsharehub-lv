import React from 'react';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import {
    faHome,
    faUserFriends,
    faFileAlt,
    faUsers,
    faClipboardList,
    faSignOutAlt,
    faMoon,
    faSun
} from '@fortawesome/free-solid-svg-icons';

export default function AdminSidebar() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <aside className={`w-64 min-h-screen transition-colors duration-300 ${
            darkMode
                ? 'bg-[#2f3136] border-r border-[#202225]'
                : 'bg-white border-r border-gray-100'
        } shadow-sm`}>
            <div className={`p-6 border-b transition-colors duration-300 ${
                darkMode ? 'border-[#202225]' : 'border-gray-100'
            }`}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5865F2] to-[#4752C4] bg-clip-text text-transparent">
                    MindshareHub
                </h1>
            </div>
            <nav className="p-4 space-y-1">
                <Link
                    href="/admin/dashboard"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        darkMode
                            ? 'text-[#B9BBBE] hover:bg-[#36393f] hover:text-[#DCDDDE]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                    <FontAwesomeIcon icon={faHome} className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                    href="/admin/pengaturan-pengguna"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        darkMode
                            ? 'text-[#B9BBBE] hover:bg-[#36393f] hover:text-[#DCDDDE]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                    <FontAwesomeIcon icon={faUserFriends} className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">User Management</span>
                </Link>

                <Link
                    href="/admin/kelola-konten"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        darkMode
                            ? 'text-[#B9BBBE] hover:bg-[#36393f] hover:text-[#DCDDDE]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                    <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Content Management</span>
                </Link>

                <Link
                    href="/admin/kelola-komunitas"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        darkMode
                            ? 'text-[#B9BBBE] hover:bg-[#36393f] hover:text-[#DCDDDE]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                    <FontAwesomeIcon icon={faUsers} className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Community Control</span>
                </Link>

                <Link
                    href="/admin/report"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        darkMode
                            ? 'text-[#B9BBBE] hover:bg-[#36393f] hover:text-[#DCDDDE]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                    <FontAwesomeIcon icon={faClipboardList} className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Reports</span>
                </Link>

                <div className={`pt-4 mt-4 border-t transition-colors duration-300 ${
                    darkMode ? 'border-[#202225]' : 'border-gray-100'
                }`}>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            darkMode
                                ? 'text-[#B9BBBE] hover:bg-[#36393f] hover:text-[#ED4245]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                        }`}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
