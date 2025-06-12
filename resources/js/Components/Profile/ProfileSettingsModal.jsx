import React, { useState } from 'react';
import ProfilePictureModal from './ProfilePictureModal';

export default function ProfileSettingsModal({ show, onClose, user }) {
    const [showProfilePicture, setShowProfilePicture] = useState(false);

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-gray-700 rounded-lg shadow w-full max-w-md">
                    <div className="flex items-center justify-between p-4 border-b border-gray-600">
                        <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <i className="fi fi-rr-cross text-xl"></i>
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="text-gray-300">
                            <p>Username: {user?.username}</p>
                            <p>Email: {user?.email}</p>
                        </div>
                        <div className="space-y-3">
                            <button 
                                onClick={() => setShowProfilePicture(true)}
                                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
                            >
                                Edit Profile
                            </button>
                            <button
                                disabled
                                className="w-full bg-gray-600 text-white py-2 px-4 rounded opacity-50 cursor-not-allowed"
                            >
                                Ganti Kata Sandi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showProfilePicture && (
                <ProfilePictureModal 
                    show={showProfilePicture}
                    onClose={() => setShowProfilePicture(false)}
                    user={user}
                />
            )}
        </>
    );
}
