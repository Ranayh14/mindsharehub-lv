import React, { useState } from 'react';
import axios from 'axios';

export default function ProfilePictureModal({ show, onClose, user }) {
    const [selectedPicture, setSelectedPicture] = useState(null);
    
    if (!show) return null;

    const profilePictures = Array.from({ length: 12 }, (_, i) => `pp${i + 1}.png`);

    const handleSave = async () => {
        if (!selectedPicture) return;

        try {
            await axios.post('/profile/update-picture', {
                profile_picture: selectedPicture
            });
            window.location.reload(); // Refresh untuk menampilkan perubahan
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-700 rounded-lg shadow w-full max-w-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-600">
                    <h3 className="text-xl font-semibold text-white">Ganti Profile Picture</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="fi fi-rr-cross text-xl"></i>
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-4">
                        {profilePictures.map((pic) => (
                            <button
                                key={pic}
                                onClick={() => setSelectedPicture(pic)}
                                className={`relative rounded-full overflow-hidden ${
                                    selectedPicture === pic ? 'ring-2 ring-blue-500' : ''
                                }`}
                            >
                                <img
                                    src={`/images/${pic}`}
                                    alt={`Profile ${pic}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            disabled={!selectedPicture}
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
