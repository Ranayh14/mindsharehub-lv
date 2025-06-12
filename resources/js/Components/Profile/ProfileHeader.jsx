import React, { useState } from 'react';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function ProfileHeader({ user }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <header className="bg-gray-800 p-4 flex items-center justify-between pt-10 pl-8">
                <div className="flex items-center space-x-4">
                    <img 
                        src={`/images/${user?.profile_picture || 'pp1.png'}`} 
                        alt="Profile" 
                        className="rounded-full w-20 h-20 object-cover"
                    />
                    <div>
                        <span className="text-white text-xl font-bold">{user?.username}</span>
                        <div className="flex items-center mt-1">
                            <div className="w-40 bg-gray-400 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{width: '0%'}}></div>
                            </div>
                            <span className="ml-2 text-gray-300">0/100</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 pr-5"
                >
                    <i className="fi fi-rr-settings text-3xl text-gray-400"></i>
                </button>
            </header>

            <ProfileSettingsModal 
                show={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
            />
        </>
    );
}
