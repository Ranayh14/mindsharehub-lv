import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import PostsList from './PostsList';
import CommentsList from './CommentsList';
import LikesList from './LikesList';
import ProfileSettingsModal from './ProfileSettingsModal';
import ProfilePictureModal from './ProfilePictureModal';
import Sidebar from './Sidebar';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('/api/profile');
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    return (
        <div className="flex-1 flex flex-col ml-64 min-h-screen mr-4">
            <Sidebar />
            <ProfileHeader 
                user={userData?.user}
                onSettingsClick={() => setIsSettingsOpen(true)}
            />

            <Tab.Group>
                <Tab.List className="bg-gray-800 text-gray-400 flex justify-center border-b border-gray-700 space-x-12">
                    <Tab className={({ selected }) =>
                        `px-4 py-2 ${selected ? 'text-white border-b-2 border-white' : 'hover:text-white'}`
                    }>
                        Posts
                    </Tab>
                    <Tab className={({ selected }) =>
                        `px-4 py-2 ${selected ? 'text-white border-b-2 border-white' : 'hover:text-white'}`
                    }>
                        Replies
                    </Tab>
                    <Tab className={({ selected }) =>
                        `px-4 py-2 ${selected ? 'text-white border-b-2 border-white' : 'hover:text-white'}`
                    }>
                        Likes
                    </Tab>
                </Tab.List>

                <Tab.Panels className="p-4">
                    <Tab.Panel>
                        <PostsList posts={userData?.posts} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <CommentsList comments={userData?.comments} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <LikesList likes={userData?.likes} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <ProfileSettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onEditPicture={() => {
                    setIsSettingsOpen(false);
                    setIsPictureModalOpen(true);
                }}
                user={userData?.user}
            />

            <ProfilePictureModal 
                isOpen={isPictureModalOpen}
                onClose={() => setIsPictureModalOpen(false)}
                onUpdate={fetchUserData}
            />
        </div>
    );
};

export default Profile;
