import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faTrash,
    faPlus,
    faEye,
    faCheck,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function Index({ contents }) {
    const { darkMode } = useDarkMode();
    const { delete: destroy } = useForm();

    const handleDelete = (contentId) => {
        if (confirm('Are you sure you want to delete this content?')) {
            destroy(route('admin.content.destroy', contentId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#36393f]' : 'bg-gray-50'}`}>
            <Head title="Content Management" />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                                Content Management
                            </h2>
                            <Link
                                href={route('admin.content.create')}
                                className={`px-4 py-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2`}
                            >
                                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                                <span>Create Content</span>
                            </Link>
                        </div>

                        <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} rounded-xl shadow-lg border ${darkMode ? 'border-[#202225]' : 'border-gray-100'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`border-b ${darkMode ? 'border-[#202225]' : 'border-gray-100'}`}>
                                            <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>Title</th>
                                            <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>Content</th>
                                            <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>Author</th>
                                            <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>Status</th>
                                            <th className={`px-6 py-4 text-center text-sm font-medium ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {contents && contents.length > 0 ? (
                                            contents.map((content) => (
                                                <tr
                                                    key={content.id}
                                                    className={`${darkMode ? 'hover:bg-[#36393f]' : 'hover:bg-gray-50'} transition-colors duration-200`}
                                                >
                                                    <td className={`px-6 py-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                                                        <div className="line-clamp-2">{content.title}</div>
                                                    </td>
                                                    <td className={`px-6 py-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                                                        <div className="line-clamp-2">{content.content}</div>
                                                    </td>
                                                    <td className={`px-6 py-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                                                        {content.user?.username || 'Unknown'}
                                                    </td>
                                                    <td className={`px-6 py-4`}>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            content.is_published
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            <FontAwesomeIcon
                                                                icon={content.is_published ? faCheck : faTimes}
                                                                className="w-3 h-3 mr-1"
                                                            />
                                                            {content.is_published ? 'Published' : 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center space-x-3">
                                                            <Link
                                                                href={route('admin.content.show', content.id)}
                                                                className={`p-2 rounded-lg ${
                                                                    darkMode
                                                                        ? 'bg-[#4f545c] hover:bg-[#5865F2] text-[#DCDDDE]'
                                                                        : 'bg-gray-100 hover:bg-indigo-500 text-gray-600 hover:text-white'
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.content.edit', content.id)}
                                                                className={`p-2 rounded-lg ${
                                                                    darkMode
                                                                        ? 'bg-[#4f545c] hover:bg-[#5865F2] text-[#DCDDDE]'
                                                                        : 'bg-gray-100 hover:bg-indigo-500 text-gray-600 hover:text-white'
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(content.id)}
                                                                className={`p-2 rounded-lg ${
                                                                    darkMode
                                                                        ? 'bg-[#4f545c] hover:bg-red-500 text-[#DCDDDE]'
                                                                        : 'bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white'
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className={`px-6 py-8 text-center ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'}`}
                                                >
                                                    No content available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
