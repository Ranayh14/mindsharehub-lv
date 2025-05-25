import React, { useState, Fragment } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import {
    faBan,
    faUnlock,
    faSearch,
    faSun,
    faMoon,
    faFilter,
    faExclamationCircle,
    faStar
} from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import { useDarkMode } from '../../Contexts/DarkModeContext';

export default function UserManagement({ users }) {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [searchTerm, setSearchTerm] = useState('');
    const [showBanModal, setShowBanModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const { data, setData, post, processing, reset } = useForm({
        reason: '',
    });

    // Fungsi untuk mengecek apakah akun baru (kurang dari 24 jam)
    const isNewAccount = (created_at) => {
        if (!created_at) return false;
        const accountDate = new Date(created_at);
        const now = new Date();
        const diffHours = (now - accountDate) / (1000 * 60 * 60);
        return diffHours < 24;
    };

    // Fungsi untuk format tanggal yang lebih informatif
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffHours < 1) {
            return 'Baru saja';
        } else if (diffHours < 24) {
            return `${diffHours} jam yang lalu`;
        } else {
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    const filteredUsers = users
        .filter(user => {
            const matchesSearch = (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' ||
                                (filterStatus === 'banned' && user.is_banned) ||
                                (filterStatus === 'active' && !user.is_banned);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            // Sort by created_at in descending order (newest first)
            return new Date(b.created_at) - new Date(a.created_at);
        });

    const handleBanUser = (user) => {
        setSelectedUser(user);
        setData('reason', '');
        setShowBanModal(true);
    };

    const submitBan = () => {
        if (!selectedUser) {
            toast.error('No user selected for banning');
            return;
        }

        if (!data.reason.trim()) {
            toast.error('Please provide a reason for banning');
            return;
        }

        // Close modal immediately
        setShowBanModal(false);

        post(`/admin/users/${selectedUser.id}/ban`, {
            reason: data.reason
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setData('reason', '');
                setSelectedUser(null);
                toast.success(`Successfully banned ${selectedUser.username}`);

                const updatedUser = { ...selectedUser, is_banned: true };
                const userIndex = users.findIndex(u => u.id === selectedUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = updatedUser;
                }
            },
            onError: (error) => {
                console.error('Ban error:', error);
                toast.error(error.message || 'Failed to ban user');
                // Don't reopen modal on error, just show toast notification
            }
        });
    };

    const handleUnban = (userId) => {
        post(`/admin/users/${userId}/unban`, {
            _method: 'POST'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Unban error:', errors);
            }
        });
    };

    return (
        <>
            <Head title="Pengaturan Pengguna" />
            <div className={`min-h-screen flex transition-colors duration-300 ${
                darkMode ? 'bg-[#202225]' : 'bg-gray-50'
            }`}>
                <Toaster position="top-right" />
                <AdminSidebar darkMode={darkMode} />
                <main className="flex-1 p-8">
                    {/* Header Section */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className={`text-2xl font-bold ${
                                darkMode ? 'text-gray-100' : 'text-gray-800'
                            }`}>Pengaturan Pengguna</h2>
                            <p className={`mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>Kelola pengguna dan hak akses platform</p>
                        </div>
                        {/* Saklar dark mode modern di kanan atas */}
                        <button
                            onClick={toggleDarkMode}
                            className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300
                                ${darkMode ? 'bg-[#5865F2]' : 'bg-gray-300'}`}
                            aria-label="Toggle dark mode"
                        >
                            <span className={`absolute left-1 z-10 transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                                <FontAwesomeIcon
                                    icon={darkMode ? faMoon : faSun}
                                    className="w-6 h-6 text-white"
                                />
                            </span>
                            <span
                                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                    darkMode ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Search and Filter Section */}
                    <div className={`mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                        <div className={`relative ${
                            darkMode ? 'text-gray-200' : 'text-gray-600'
                        }`}>
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FontAwesomeIcon icon={faSearch} className="w-5 h-5 opacity-60" />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari pengguna..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                                    darkMode
                                    ? 'bg-[#2f3136] border-[#202225] text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200'
                                }`}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FontAwesomeIcon icon={faFilter} className={`w-5 h-5 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                            </span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                                    darkMode
                                    ? 'bg-[#2f3136] border-[#202225] text-white'
                                    : 'bg-white border-gray-200'
                                }`}
                            >
                                <option value="all">Semua Pengguna</option>
                                <option value="active">Pengguna Aktif</option>
                                <option value="banned">Pengguna Dibanned</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className={`rounded-xl shadow-sm border overflow-hidden transition-colors duration-200 ${
                        darkMode
                        ? 'bg-[#36393f] border-[#202225]'
                        : 'bg-white border-gray-100'
                    }`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`border-b transition-colors duration-200 ${
                                        darkMode ? 'border-[#202225] bg-[#2f3136]' : 'border-gray-200'
                                    }`}>
                                        <th className={`text-left py-4 px-6 text-sm font-semibold ${
                                            darkMode ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Username</th>
                                        <th className={`text-left py-4 px-6 text-sm font-semibold ${
                                            darkMode ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Email</th>
                                        <th className={`text-left py-4 px-6 text-sm font-semibold ${
                                            darkMode ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Status</th>
                                        <th className={`text-left py-4 px-6 text-sm font-semibold ${
                                            darkMode ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Tanggal Bergabung</th>
                                        <th className={`text-right py-4 px-6 text-sm font-semibold ${
                                            darkMode ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className={`border-b last:border-b-0 transition-colors duration-200 ${
                                                darkMode
                                                ? 'border-[#202225] hover:bg-[#2f3136]'
                                                : 'border-gray-100 hover:bg-gray-50'
                                            } ${isNewAccount(user.created_at)
                                                ? darkMode
                                                    ? 'bg-[#34373c]'
                                                    : 'bg-blue-50'
                                                : ''
                                            }`}
                                        >
                                            <td className={`py-4 px-6 ${
                                                darkMode ? 'text-gray-300' : 'text-gray-800'
                                            }`}>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-semibold">
                                                        {(user.username || user.email || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span>{user.username || user.email}</span>
                                                        {isNewAccount(user.created_at) && (
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                                darkMode
                                                                ? 'bg-[#5865f2] bg-opacity-20 text-[#5865f2]'
                                                                : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                <FontAwesomeIcon icon={faStar} className="w-3 h-3 mr-1" />
                                                                Baru
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`py-4 px-6 ${
                                                darkMode ? 'text-gray-300' : 'text-gray-800'
                                            }`}>{user.email}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.is_banned
                                                    ? darkMode
                                                        ? 'bg-red-500 bg-opacity-20 text-red-400'
                                                        : 'bg-red-100 text-red-800'
                                                    : darkMode
                                                        ? 'bg-green-500 bg-opacity-20 text-green-400'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.is_banned ? 'Dibanned' : 'Aktif'}
                                                </span>
                                            </td>
                                            <td className={`py-4 px-6 ${
                                                darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                <div className="flex flex-col">
                                                    <span>{formatDate(user.created_at)}</span>
                                                    {isNewAccount(user.created_at) && (
                                                        <span className={`text-xs ${
                                                            darkMode ? 'text-[#5865f2]' : 'text-blue-500'
                                                        }`}>Pengguna baru</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {user.is_banned ? (
                                                    <button
                                                        onClick={() => handleUnban(user.id)}
                                                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                            darkMode
                                                            ? 'bg-green-500 bg-opacity-10 text-green-400 hover:bg-opacity-20'
                                                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon icon={faUnlock} className="w-4 h-4 mr-2" />
                                                        Aktifkan
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBanUser(user)}
                                                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                            darkMode
                                                            ? 'bg-red-500 bg-opacity-10 text-red-400 hover:bg-opacity-20'
                                                            : 'text-red-700 bg-red-100 hover:bg-red-200'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon icon={faBan} className="w-4 h-4 mr-2" />
                                                        Ban
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* Ban Modal */}
                <Transition appear show={showBanModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => !processing && setShowBanModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                                        darkMode ? 'bg-[#36393f]' : 'bg-white'
                                    }`}>
                                        <Dialog.Title as="h3" className={`text-lg font-medium leading-6 ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Ban Pengguna
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className={`text-sm ${
                                                darkMode ? 'text-gray-300' : 'text-gray-500'
                                            }`}>
                                                Apakah Anda yakin ingin mem-ban {selectedUser?.username}?
                                            </p>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                submitBan();
                                            }} className="mt-4">
                                                <label className={`block text-sm font-medium ${
                                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    Alasan Ban
                                                </label>
                                                <textarea
                                                    value={data.reason}
                                                    onChange={e => setData('reason', e.target.value)}
                                                    disabled={processing}
                                                    className={`mt-1 block w-full rounded-md shadow-sm ${
                                                        darkMode
                                                            ? 'bg-[#2f3136] text-white border-[#202225]'
                                                            : 'border-gray-300'
                                                    } focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                                        processing ? 'opacity-50' : ''
                                                    }`}
                                                    rows="3"
                                                    placeholder="Masukkan alasan ban..."
                                                    required
                                                />
                                                <div className="mt-4 flex justify-end space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => !processing && setShowBanModal(false)}
                                                        disabled={processing}
                                                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                            darkMode
                                                                ? 'bg-[#2f3136] text-gray-300 hover:bg-[#36393f]'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        Batal
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={!data.reason.trim() || processing}
                                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${
                                                            !data.reason.trim() || processing
                                                                ? 'bg-red-400 cursor-not-allowed'
                                                                : 'bg-red-600 hover:bg-red-700'
                                                        }`}
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Memproses...
                                                            </>
                                                        ) : (
                                                            'Ban User'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    );
}
