import React, { useState, useEffect, Fragment } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import {
    faPlus,
    faTrash,
    faSun,
    faMoon,
    faExclamationTriangle,
    faEdit,
    faBan,
    faUnlock,
    faStar,
    faClock,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// Configure axios
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default function UserManagement({ users, flash }) {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showUnbanModal, setShowUnbanModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        reason: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/users/${data.id}`, {
                onSuccess: () => {
                    setShowForm(false);
                    setIsEditing(false);
                    reset();
                },
                preserveScroll: true
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
                preserveScroll: true
            });
        }
    };

    const handleEdit = (user) => {
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleBan = (user) => {
        setSelectedUser(user);
        setData('reason', '');
        setShowBanModal(true);
    };

    const handleUnban = (user) => {
        setSelectedUser(user);
        setShowUnbanModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            destroy(`/admin/users/${userToDelete.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                },
                preserveScroll: true
            });
        }
    };

    const showNotification = (message, type = 'success') => {
        if (type === 'success') {
            setSuccess(message);
            setError(null);
        } else {
            setError(message);
            setSuccess(null);
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 3000);
    };

    const confirmBan = () => {
        if (!selectedUser || !data.reason.trim() || processing) return;

        post(route('admin.users.ban', { id: selectedUser.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowBanModal(false);
                setSelectedUser(null);
                reset();
                window.location.reload();
            },
            onError: () => {
                alert('Gagal mem-banned pengguna. Silakan coba lagi.');
            }
        });
    };

    const confirmUnban = () => {
        if (!selectedUser || processing) return;

        post(route('admin.users.unban', { id: selectedUser.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowUnbanModal(false);
                setSelectedUser(null);
                window.location.reload();
            },
            onError: () => {
                alert('Gagal meng-unban pengguna. Silakan coba lagi.');
            }
        });
    };

    const isNewAccount = (createdAt) => {
        const userDate = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - userDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 1;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari yang lalu`;
        if (diffDays < 30) return `${Math.floor(diffDays/7)} minggu yang lalu`;
        if (diffDays < 365) return `${Math.floor(diffDays/30)} bulan yang lalu`;
        return `${Math.floor(diffDays/365)} tahun yang lalu`;
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Head title="User Management" />

            {/* Notifications */}
            {(success || error) && (
                <div className="fixed top-4 right-4 z-50">
                    <div className={`px-4 py-2 rounded-lg shadow-lg ${
                        success
                            ? darkMode ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'
                            : darkMode ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'
                    }`}>
                        {success || error}
                    </div>
                </div>
            )}

            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                User Management
                            </h1>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleDarkMode}
                                    className={`p-2 rounded-full ${
                                        darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                                </button>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className={`px-4 py-2 rounded-md ${
                                        darkMode
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Tambah User
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg shadow overflow-hidden ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className={`p-4 border-b ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className={`flex items-center px-4 py-2 rounded-lg ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <FontAwesomeIcon icon={faSearch} className={`w-5 h-5 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <input
                                    type="text"
                                    placeholder="Cari pengguna..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`ml-3 flex-1 bg-transparent border-none focus:ring-0 ${
                                        darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Nama
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Email
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Tanggal Bergabung
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Status
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y divide-gray-200 ${
                                    darkMode ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className={`${
                                            isNewAccount(user.created_at) ? darkMode ? 'bg-blue-500/10' : 'bg-blue-50' : ''
                                        }`}>
                                            <td className={`px-6 py-4 whitespace-nowrap ${
                                                darkMode ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                <div className="flex items-center">
                                                    {user.name}
                                                    {isNewAccount(user.created_at) && (
                                                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium flex items-center ${
                                                            darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                            <FontAwesomeIcon icon={faStar} className="w-3 h-3 mr-1" />
                                                            Baru
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${
                                                darkMode ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                {user.email}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${
                                                darkMode ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faClock} className={`w-4 h-4 mr-2 ${
                                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`} />
                                                    {formatDate(user.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.is_banned
                                                        ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                                                        : darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                                                }`}>
                                                    {user.is_banned ? 'Dibanned' : 'Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className={`mr-2 ${
                                                        darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'
                                                    }`}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                {user.is_banned ? (
                                                    <button
                                                        onClick={() => handleUnban(user)}
                                                        className={`mr-2 ${
                                                            darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon icon={faUnlock} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBan(user)}
                                                        className={`mr-2 ${
                                                            darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon icon={faBan} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className={`${
                                                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                                                    }`}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Form Modal */}
                    <Transition appear show={showForm} as={Fragment}>
                        <Dialog
                            as="div"
                            className="fixed inset-0 z-10 overflow-y-auto"
                            onClose={() => {
                                setShowForm(false);
                                setIsEditing(false);
                                reset();
                            }}
                        >
                            <div className="min-h-screen px-4 text-center">
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                                <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${
                                    darkMode ? 'dark:bg-gray-800 dark:text-white' : ''
                                }`}>
                                    <Dialog.Title
                                        as="h3"
                                        className={`text-lg font-medium leading-6 ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}
                                    >
                                        {isEditing ? 'Edit User' : 'Tambah User Baru'}
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-sm font-medium ${
                                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    Nama
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className={`mt-1 block w-full rounded-md shadow-sm ${
                                                        darkMode
                                                            ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                                    }`}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium ${
                                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className={`mt-1 block w-full rounded-md shadow-sm ${
                                                        darkMode
                                                            ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                                    }`}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium ${
                                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    Password {isEditing && '(Kosongkan jika tidak ingin mengubah password)'}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    className={`mt-1 block w-full rounded-md shadow-sm ${
                                                        darkMode
                                                            ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                                    }`}
                                                    {...(!isEditing && { required: true })}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium ${
                                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    Role
                                                </label>
                                                <select
                                                    value={data.role}
                                                    onChange={e => setData('role', e.target.value)}
                                                    className={`mt-1 block w-full rounded-md shadow-sm ${
                                                        darkMode
                                                            ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                                    }`}
                                                    required
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowForm(false);
                                                    setIsEditing(false);
                                                    reset();
                                                }}
                                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                    darkMode
                                                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                                    processing
                                                        ? 'bg-indigo-400 cursor-not-allowed'
                                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                                }`}
                                            >
                                                {processing ? 'Mempro-esting...' : (isEditing ? 'Simpan Perubahan' : 'Tambah User')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    {/* Delete Confirmation Modal */}
                    <Transition appear show={showDeleteModal} as={Fragment}>
                        <Dialog
                            as="div"
                            className="fixed inset-0 z-10 overflow-y-auto"
                            onClose={() => setShowDeleteModal(false)}
                        >
                            <div className="min-h-screen px-4 text-center">
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                                <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${
                                    darkMode ? 'dark:bg-gray-800 dark:text-white' : ''
                                }`}>
                                    <Dialog.Title
                                        as="h3"
                                        className={`text-lg font-medium leading-6 ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}
                                    >
                                        Konfirmasi Hapus User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className={`text-sm ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Apakah Anda yakin ingin menghapus user {userToDelete?.name}?
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(false)}
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                darkMode
                                                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmDelete}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                                darkMode
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    {/* Ban Confirmation Modal */}
                    <Transition appear show={showBanModal} as={Fragment}>
                        <Dialog
                            as="div"
                            className="fixed inset-0 z-10 overflow-y-auto"
                            onClose={() => !processing && setShowBanModal(false)}
                        >
                            <div className="min-h-screen px-4 text-center">
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                                <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl ${
                                    darkMode ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                    <Dialog.Title as="h3" className={`text-lg font-medium leading-6 ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        Ban Pengguna
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                            Apakah Anda yakin ingin mem-ban {selectedUser?.username}?
                                        </p>
                                        <div className="mt-4">
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
                                                        ? 'bg-gray-700 text-white border-gray-600'
                                                        : 'border-gray-300'
                                                } focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                                                rows="3"
                                                placeholder="Masukkan alasan ban..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => !processing && setShowBanModal(false)}
                                            disabled={processing}
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                darkMode
                                                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmBan}
                                            disabled={!data.reason.trim() || processing}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                                !data.reason.trim() || processing
                                                    ? 'bg-red-400 cursor-not-allowed'
                                                    : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                        >
                                            {processing ? 'Memproses...' : 'Ban Pengguna'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    {/* Unban Confirmation Modal */}
                    <Transition appear show={showUnbanModal} as={Fragment}>
                        <Dialog
                            as="div"
                            className="fixed inset-0 z-10 overflow-y-auto"
                            onClose={() => setShowUnbanModal(false)}
                        >
                            <div className="min-h-screen px-4 text-center">
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                                <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${
                                    darkMode ? 'dark:bg-gray-800 dark:text-white' : ''
                                }`}>
                                    <Dialog.Title
                                        as="h3"
                                        className={`text-lg font-medium leading-6 flex items-center gap-3 ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUnlock}
                                            className="text-green-500 w-5 h-5"
                                        />
                                        Konfirmasi Unban Pengguna
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className={`text-sm ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            Apakah Anda yakin ingin menghapus ban dari pengguna ini? Pengguna akan dapat mengakses kembali akun mereka.
                                        </p>
                                        {selectedUser && (
                                            <div className={`mt-3 p-3 rounded-lg ${
                                                darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                            }`}>
                                                <p className={`text-sm font-medium ${
                                                    darkMode ? 'text-gray-200' : 'text-gray-700'
                                                }`}>
                                                    {selectedUser.name}
                                                </p>
                                                <p className={`text-sm ${
                                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    {selectedUser.email}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowUnbanModal(false)}
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                darkMode
                                                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmUnban}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                                darkMode
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        >
                                            Unban Pengguna
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </main>
            </div>
        </div>
    );
}
