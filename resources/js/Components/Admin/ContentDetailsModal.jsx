import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';

export default function ContentDetailsModal({ contentId, contentType, onClose }) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadContentDetails();
    }, [contentId, contentType]);

    const loadContentDetails = async () => {
        try {
            setLoading(true);
            const response = await adminService.getContentDetails(contentId, contentType);
            setContent(response.data);
        } catch (error) {
            setError('Failed to load content details');
            console.error('Error loading content details:', error);
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

    if (!content) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {contentType === 'posts' ? 'Post Details' :
                         contentType === 'diaries' ? 'Diary Details' :
                         'Comment Details'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Author Info */}
                    <div className="flex items-center mb-6">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                            {content.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {content.author.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {content.author.email}
                            </div>
                        </div>
                        <div className="ml-auto">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                content.status === 'published' ? 'bg-green-100 text-green-800' :
                                content.status === 'hidden' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {content.status}
                            </span>
                        </div>
                    </div>

                    {/* Content Details */}
                    {contentType === 'diaries' && (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {content.title}
                            </h3>
                            <div className="mt-2 flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    content.mood === 'happy' ? 'bg-green-100 text-green-800' :
                                    content.mood === 'sad' ? 'bg-blue-100 text-blue-800' :
                                    content.mood === 'angry' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {content.mood}
                                </span>
                                {content.tags?.map(tag => (
                                    <span
                                        key={tag}
                                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="prose max-w-none">
                        <p className="text-gray-900 whitespace-pre-wrap">
                            {content.content}
                        </p>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                        Posted {new Date(content.created_at).toLocaleString()}
                    </div>

                    {/* Engagement Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Likes</div>
                            <div className="mt-1 text-2xl font-semibold text-gray-900">
                                {content.likes_count}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Comments</div>
                            <div className="mt-1 text-2xl font-semibold text-gray-900">
                                {content.comments_count}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Reports</div>
                            <div className="mt-1 text-2xl font-semibold text-gray-900">
                                {content.reports_count}
                            </div>
                        </div>
                    </div>

                    {/* Reports Section */}
                    {content.reports && content.reports.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Reports
                            </h3>
                            <div className="space-y-4">
                                {content.reports.map(report => (
                                    <div key={report.id} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    Reported by {report.reporter.name}
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    {report.reason}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                report.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 