import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faTrash,
    faSearch
} from '@fortawesome/free-solid-svg-icons';

export default function Index({ users, posts, selectedUser, filters }) {
    const { darkMode } = useDarkMode();
    const [suggestions, setSuggestions] = useState([]);
    const { delete: destroy } = useForm();
    const { get } = useForm();

    const handleSearch = (value) => {
        if (value.length === 0) {
            setSuggestions([]);
            return;
        }

        // Gunakan route untuk search users
        axios.get(route('admin.community.search-users', { search: value }))
            .then(response => {
                setSuggestions(response.data);
            });
    };

    const selectUser = (username) => {
        get(route('admin.community.index', { search: username }));
    };

    const handleDelete = (postId) => {
        if (confirm('Are you sure you want to delete this post?')) {
            destroy(route('admin.community.delete-post', postId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#36393f]' : 'bg-gray-50'}`}>
            <Head title="Community Management" />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                            Manage Posts
                        </h3>

                        {/* Search Form */}
                        <div className="mt-4 relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`p-2 w-full rounded ${
                                        darkMode 
                                            ? 'bg-[#202225] text-gray-100' 
                                            : 'bg-white text-gray-900 border border-gray-300'
                                    }`}
                                    placeholder="Search users..."
                                    defaultValue={filters.search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <FontAwesomeIcon 
                                    icon={faSearch} 
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                />
                            </div>

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className={`absolute w-full mt-1 rounded-md shadow-lg z-10 ${
                                    darkMode ? 'bg-[#202225]' : 'bg-white'
                                }`}>
                                    {suggestions.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`cursor-pointer p-2 ${
                                                darkMode 
                                                    ? 'hover:bg-[#36393f] text-gray-200' 
                                                    : 'hover:bg-gray-100 text-gray-900'
                                            }`}
                                            onClick={() => selectUser(user.username)}
                                        >
                                            {user.username}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected User Info */}
                        {selectedUser && (
                            <div className="mt-4 flex items-center justify-between">
                                <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    <strong>User Found:</strong> {selectedUser.username}
                                </span>
                            </div>
                        )}

                        {/* Posts Table */}
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={darkMode ? 'bg-[#202225]' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        } uppercase tracking-wider`}>No</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        } uppercase tracking-wider`}>Post Content</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        } uppercase tracking-wider`}>Date</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        } uppercase tracking-wider`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {posts.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className={`px-6 py-4 text-center ${
                                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}
                                            >
                                                No posts found.
                                            </td>
                                        </tr>
                                    ) : (
                                        posts.map((post, index) => (
                                            <tr
                                                key={post.id}
                                                className={darkMode ? 'hover:bg-[#35393f]' : 'hover:bg-gray-50'}
                                            >
                                                <td className={`px-6 py-4 ${
                                                    darkMode ? 'text-gray-200' : 'text-gray-900'
                                                }`}>
                                                    {index + 1}
                                                </td>
                                                <td className={`px-6 py-4 ${
                                                    darkMode ? 'text-gray-200' : 'text-gray-900'
                                                }`}>
                                                    {post.content}
                                                </td>
                                                <td className={`px-6 py-4 ${
                                                    darkMode ? 'text-gray-200' : 'text-gray-900'
                                                }`}>
                                                    {new Date(post.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={route('admin.posts.show', post.id)}
                                                            className={`text-blue-500 hover:text-blue-700`}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 