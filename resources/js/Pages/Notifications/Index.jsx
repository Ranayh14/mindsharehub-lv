import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, notifications }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Notifications" />

            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1 p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Notifikasi</h2>
                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.id} className="bg-gray-800 p-4 rounded-lg flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-purple-500 flex items-center justify-center rounded-full">
                                        <i className="fi fi-rr-bell text-white"></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold">{notification.title}</p>
                                        <p className="text-gray-400">{notification.content}</p>
                                        <p className="text-gray-500 text-sm">{notification.created_at}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">Tidak ada notifikasi</p>
                        )}
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
