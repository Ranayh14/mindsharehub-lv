import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';

export default function UserDetailsModal({ userId, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('activity'); // activity, posts, diaries, reports

    useEffect(() => {
        loadUserDetails();
    }, [userId]);

    const loadUserDetails = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUserDetails(userId);
            setUser(response.data);
        } catch (error) {
            setError('Failed to load user details');
            console.error('Error loading user details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg">
                    <div className="text-red-600">{error}</div>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-6">
                    <div className="flex items-center">
                        <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-6">
                            <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
                            <p className="text-gray-500">{user.email}</p>
                            <div className="mt-2 flex items-center space-x-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                                    user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {user.status}
                                </span>
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-8 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`${
                                    activeTab === 'activity'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Activity Log
                            </button>
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`${
                                    activeTab === 'posts'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Posts
                            </button>
                            <button
                                onClick={() => setActiveTab('diaries')}
                                className={`${
                                    activeTab === 'diaries'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Diaries
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`${
                                    activeTab === 'reports'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Reports
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6 max-h-[50vh] overflow-y-auto">
                        {activeTab === 'activity' && (
                            <div className="space-y-4">
                                {user.activity_log.map(activity => (
                                    <div key={activity.id} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                <i className={`fas fa-${activity.icon} text-purple-600`} />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-900">{activity.description}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(activity.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'posts' && (
                            <div className="space-y-4">
                                {user.posts.map(post => (
                                    <div key={post.id} className="border rounded-lg p-4">
                                        <div className="text-sm text-gray-900">{post.content}</div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Posted {new Date(post.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'diaries' && (
                            <div className="space-y-4">
                                {user.diaries.map(diary => (
                                    <div key={diary.id} className="border rounded-lg p-4">
                                        <div className="font-medium text-gray-900">{diary.title}</div>
                                        <div className="mt-2 text-sm text-gray-900">{diary.content}</div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Written {new Date(diary.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div className="space-y-4">
                                {user.reports.map(report => (
                                    <div key={report.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div className="text-sm font-medium text-gray-900">
                                                Report #{report.id}
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                report.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-900">{report.reason}</div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Reported {new Date(report.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 