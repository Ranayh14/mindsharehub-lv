import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProfileHeader from '@/Components/Profile/ProfileHeader';
import ProfileTabs from '@/Components/Profile/ProfileTabs';
import ProfileSettingsModal from '@/Components/Profile/ProfileSettingsModal';

export default function Index({ auth, userData }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile" />
            
            <div className="flex-1 flex flex-col min-h-screen">
                <ProfileHeader 
                    user={auth.user}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                />

                <ProfileTabs 
                    posts={userData.posts}
                    comments={userData.comments}
                    likes={userData.likedPosts}
                />

                <ProfileSettingsModal 
                    show={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onEditPicture={() => {
                        setIsSettingsOpen(false);
                        // Handle edit picture logic
                    }}
                    user={auth.user}
                />
            </div>
        </AuthenticatedLayout>
    );
}
