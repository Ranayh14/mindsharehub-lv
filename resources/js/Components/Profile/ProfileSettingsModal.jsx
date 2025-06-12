import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProfileSettingsModal({ show, onClose, onEditPicture, user }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-700 rounded-lg shadow w-full max-w-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-600">
                    <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 text-white">
                    <p>Username: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
                <div className="p-4 flex flex-col space-y-3">
                    <button
                        onClick={onEditPicture}
                        className="bg-gray-600 text-white w-full py-2 rounded-full hover:bg-gray-500"
                    >
                        Edit Profile
                    </button>
                    <Link
                        href="/password/change"
                        className="bg-gray-600 text-white w-full py-2 rounded-full hover:bg-gray-500 text-center"
                    >
                        Ganti Kata Sandi
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="bg-gray-600 text-white w-full py-2 rounded-full hover:bg-gray-500"
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </div>
    );
}
