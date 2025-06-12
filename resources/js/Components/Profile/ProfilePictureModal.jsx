import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureModal = ({ isOpen, onClose, onUpdate }) => {
    const [selectedPicture, setSelectedPicture] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('/api/profile/update-picture', {
                profile_picture: selectedPicture
            });

            if (response.data.status === 'success') {
                setFeedback('Profile picture updated successfully');
                onUpdate();
                setTimeout(() => {
                    onClose();
                    setFeedback('');
                }, 2000);
            }
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Error updating profile picture');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-700 rounded-lg p-6 max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">Change Profile Picture</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <label key={i} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="profile_picture"
                                    value={`pp${i + 1}.png`}
                                    onChange={(e) => setSelectedPicture(e.target.value)}
                                    className="hidden"
                                />
                                <img
                                    src={`/assets/pp${i + 1}.png`}
                                    alt={`Profile ${i + 1}`}
                                    className={`w-20 h-20 object-cover rounded-full border-2 
                                        ${selectedPicture === `pp${i + 1}.png` ? 'border-blue-500' : 'border-transparent'}
                                        hover:border-blue-500`}
                                />
                            </label>
                        ))}
                    </div>

                    {feedback && (
                        <div className={`text-center ${feedback.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                            {feedback}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePictureModal;
