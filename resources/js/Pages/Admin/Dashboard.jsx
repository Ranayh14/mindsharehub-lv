import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { adminService } from '@/services/api';
import AppLayout from '@/Layouts/AppLayout';
import UserManagement from '@/Components/Admin/UserManagement';
import ContentManagement from '@/Components/Admin/ContentManagement';
import ReportManagement from '@/Components/Admin/ReportManagement';
import PreferencesManagement from '@/Components/Admin/PreferencesManagement';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalContent: 0,
        totalReports: 0,
        pendingReports: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await adminService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading admin stats:', error);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />;
            case 'content':
                return <ContentManagement />;
            case 'reports':
                return <ReportManagement />;
            case 'preferences':
                return <PreferencesManagement />;
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Admin Dashboard
                    </h1>

                    {/* Stats Cards */}
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-users text-purple-600 text-3xl" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Users
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats.totalUsers}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-file-alt text-blue-600 text-3xl" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Content
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats.totalContent}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-flag text-red-600 text-3xl" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Reports
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats.totalReports}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-exclamation-circle text-yellow-600 text-3xl" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Pending Reports
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats.pendingReports}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mt-8 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`${
                                    activeTab === 'users'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                User Management
                            </button>
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`${
                                    activeTab === 'content'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Content Management
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`${
                                    activeTab === 'reports'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Report Management
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`${
                                    activeTab === 'preferences'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Preferences
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 