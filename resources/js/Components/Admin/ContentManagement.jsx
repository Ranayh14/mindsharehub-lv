import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import ContentDetailsModal from './ContentDetailsModal';

export default function ContentManagement() {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [contentType, setContentType] = useState('posts'); // posts, diaries, comments
    const [selectedContent, setSelectedContent] = useState(null);

    useEffect(() => {
        loadContent();
    }, [currentPage, searchTerm, contentType]);

    const loadContent = async () => {
        try {
            setLoading(true);
            const response = await adminService.getContent({
                page: currentPage,
                search: searchTerm,
                type: contentType,
            });
            setContent(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setError('Failed to load content');
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContentStatusChange = async (contentId, newStatus) => {
        try {
            await adminService.updateContentStatus(contentId, newStatus);
            setContent(content.map(item => 
                item.id === contentId ? { ...item, status: newStatus } : item
            ));
        } catch (error) {
            console.error('Error updating content status:', error);
            alert('Failed to update content status');
        }
    };

    const handleDeleteContent = async (contentId) => {
        if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
            return;
        }

        try {
            await adminService.deleteContent(contentId);
            setContent(content.filter(item => item.id !== contentId));
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('Failed to delete content');
        }
    };

    const handleViewContentDetails = (contentId) => {
        setSelectedContent(contentId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 flex gap-4">
                <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="posts">Posts</option>
                    <option value="diaries">Diaries</option>
                    <option value="comments">Comments</option>
                </select>
                <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Content
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {content.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {item.title || item.content.substring(0, 100)}...
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Created {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {item.author.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.author.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={item.status}
                                        onChange={(e) => handleContentStatusChange(item.id, e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                                    >
                                        <option value="published">Published</option>
                                        <option value="hidden">Hidden</option>
                                        <option value="flagged">Flagged</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewContentDetails(item.id)}
                                        className="text-purple-600 hover:text-purple-900 mr-4"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDeleteContent(item.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Content Details Modal */}
            {selectedContent && (
                <ContentDetailsModal
                    contentId={selectedContent}
                    contentType={contentType}
                    onClose={() => setSelectedContent(null)}
                />
            )}
        </div>
    );
} 