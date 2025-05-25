import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faBan,
    faUserShield,
    faUserCheck,
    faUserXmark,
    faTrash,
    faEye,
    faSun,
    faMoon
} from '@fortawesome/free-solid-svg-icons';

export default function UserManagement({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [banReason, setBanReason] = useState('');
    const { darkMode, toggleDarkMode } = useDarkMode();

    const filteredUsers = users?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleBanClick = (user) => {
        setSelectedUser(user);
        setShowBanModal(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const submitBan = () => {
        // Implement ban logic here
        setShowBanModal(false);
        setBanReason('');
    };

    const submitDelete = () => {
        // Implement delete logic here
        setShowDeleteModal(false);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#36393f]' : 'bg-gray-50'}`}>
            <Head title="Pengaturan Pengguna" />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                                Pengaturan Pengguna
                            </h2>
                            <p className={`mt-1 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>
                                Kelola pengguna dan hak akses platform
                            </p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`p-3 rounded-lg transition-all duration-300 ${
                                darkMode
                                    ? 'bg-[#2f3136] text-yellow-400 hover:bg-[#36393f]'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            } shadow-sm`}
                        >
                            <FontAwesomeIcon
                                icon={darkMode ? faSun : faMoon}
                                className="w-5 h-5"
                            />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className={`mb-6 ${darkMode ? 'bg-[#2f3136]' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari pengguna..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                                    darkMode
                                        ? 'bg-[#36393f] border-[#202225] text-[#DCDDDE] placeholder-[#72767D]'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                } focus:outline-none focus:ring-2 focus:ring-[#5865F2]`}
                            />
                            <FontAwesomeIcon
                                icon={faSearch}
                                className={`absolute left-3 top-3 ${darkMode ? 'text-[#72767D]' : 'text-gray-400'}`}
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
                        <table className="w-full">
                            <thead>
                                <tr className={`${darkMode ? 'bg-[#36393f]' : 'bg-gray-50'} border-b ${darkMode ? 'border-[#202225]' : 'border-gray-200'}`}>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Username
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Email
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Status
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Tanggal Bergabung
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-[#202225]' : 'divide-gray-200'}`}>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className={`${darkMode ? 'hover:bg-[#36393f]' : 'hover:bg-gray-50'} transition-colors duration-150`}
                                    >
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-900'}`}>
                                            {user.name}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'}`}>
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.is_banned
                                                    ? darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                                    : user.is_admin
                                                        ? darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                                                        : darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.is_banned ? 'Dibanned' : user.is_admin ? 'Admin' : 'Aktif'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'}`}>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                            {!user.is_banned ? (
                                                <button
                                                    onClick={() => handleBanClick(user)}
                                                    className={`${darkMode ? 'text-[#ED4245] hover:text-[#C03537]' : 'text-red-600 hover:text-red-900'} transition-colors duration-150`}
                                                    title="Ban User"
                                                >
                                                    <FontAwesomeIcon icon={faBan} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBanClick(user)}
                                                    className={`${darkMode ? 'text-[#3BA55C] hover:text-[#2D7D46]' : 'text-green-600 hover:text-green-900'} transition-colors duration-150`}
                                                    title="Aktifkan User"
                                                >
                                                    <FontAwesomeIcon icon={faUserCheck} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className={`${darkMode ? 'text-[#ED4245] hover:text-[#C03537]' : 'text-red-600 hover:text-red-900'} transition-colors duration-150`}
                                                title="Hapus User"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            <a
                                                href={`/admin/users/${user.id}`}
                                                className={`${darkMode ? 'text-[#5865F2] hover:text-[#4752C4]' : 'text-indigo-600 hover:text-indigo-900'} transition-colors duration-150`}
                                                title="Lihat Detail"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Ban Modal */}
                    {showBanModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full`}>
                                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-900'}`}>
                                    {selectedUser?.is_banned ? 'Aktifkan User' : 'Ban User'}
                                </h3>
                                <p className={`mb-4 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>
                                    {selectedUser?.is_banned
                                        ? `Apakah Anda yakin ingin mengaktifkan kembali ${selectedUser?.name}?`
                                        : `Apakah Anda yakin ingin mem-ban ${selectedUser?.name}?`
                                    }
                                </p>
                                {!selectedUser?.is_banned && (
                                    <textarea
                                        placeholder="Alasan ban..."
                                        value={banReason}
                                        onChange={(e) => setBanReason(e.target.value)}
                                        className={`w-full p-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? 'bg-[#36393f] border-[#202225] text-[#DCDDDE] placeholder-[#72767D]'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        } focus:outline-none focus:ring-2 focus:ring-[#5865F2]`}
                                    />
                                )}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowBanModal(false)}
                                        className={`px-4 py-2 rounded-lg ${
                                            darkMode
                                                ? 'bg-[#36393f] text-[#DCDDDE] hover:bg-[#40444B]'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } transition-colors duration-150`}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={submitBan}
                                        className={`px-4 py-2 rounded-lg ${
                                            selectedUser?.is_banned
                                                ? 'bg-[#3BA55C] hover:bg-[#2D7D46]'
                                                : 'bg-[#ED4245] hover:bg-[#C03537]'
                                        } text-white transition-colors duration-150`}
                                    >
                                        {selectedUser?.is_banned ? 'Aktifkan' : 'Ban User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full`}>
                                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-900'}`}>
                                    Hapus User
                                </h3>
                                <p className={`mb-4 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>
                                    Apakah Anda yakin ingin menghapus {selectedUser?.name}? Tindakan ini tidak dapat dibatalkan.
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className={`px-4 py-2 rounded-lg ${
                                            darkMode
                                                ? 'bg-[#36393f] text-[#DCDDDE] hover:bg-[#40444B]'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } transition-colors duration-150`}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={submitDelete}
                                        className="px-4 py-2 bg-[#ED4245] hover:bg-[#C03537] text-white rounded-lg transition-colors duration-150"
                                    >
                                        Hapus User
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
