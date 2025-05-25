import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';

export default function ReportManagement() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('pending'); // pending, resolved, all

    useEffect(() => {
        loadReports();
    }, [currentPage, filter]);

    const loadReports = async () => {
        try {
            setLoading(true);
            const response = await adminService.getReports({
                page: currentPage,
                status: filter,
            });
            setReports(response.data.reports);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setError('Failed to load reports');
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportAction = async (reportId, action, reason) => {
        try {
            await adminService.updateReport(reportId, {
                action,
                reason,
            });
            
            // Update the report status in the UI
            setReports(reports.map(report => 
                report.id === reportId 
                    ? { ...report, status: 'resolved', action, resolution_reason: reason } 
                    : report
            ));
        } catch (error) {
            console.error('Error updating report:', error);
            alert('Failed to update report');
        }
    };

    const handleTakeAction = async (reportId) => {
        const action = prompt('Enter action (ignore/warn/suspend/ban):');
        if (!action) return;

        const reason = prompt('Enter reason for this action:');
        if (!reason) return;

        await handleReportAction(reportId, action, reason);
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
            <div className="mb-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="all">All</option>
                </select>
            </div>

            <div className="space-y-4">
                {reports.map(report => (
                    <div key={report.id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Report #{report.id}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Reported {new Date(report.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                report.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {report.status}
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Reporter</h4>
                                <p className="mt-1 text-sm text-gray-900">{report.reporter.name}</p>
                                <p className="text-sm text-gray-500">{report.reporter.email}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Reported User</h4>
                                <p className="mt-1 text-sm text-gray-900">{report.reported_user.name}</p>
                                <p className="text-sm text-gray-500">{report.reported_user.email}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-500">Reason</h4>
                            <p className="mt-1 text-sm text-gray-900">{report.reason}</p>
                        </div>

                        {report.content && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-500">Reported Content</h4>
                                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-900">{report.content}</p>
                                </div>
                            </div>
                        )}

                        {report.status === 'resolved' && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-500">Resolution</h4>
                                <p className="mt-1 text-sm text-gray-900">
                                    Action taken: {report.action}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Reason: {report.resolution_reason}
                                </p>
                            </div>
                        )}

                        {report.status === 'pending' && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleTakeAction(report.id)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    Take Action
                                </button>
                            </div>
                        )}
                    </div>
                ))}
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
        </div>
    );
} 