import React from 'react';
import { Tab } from '@headlessui/react';
import { formatTimeAgo } from '@/utils/timeAgo';

export default function ProfileTabs({ posts, comments, likes }) {
    return (
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
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post.id} className="bg-gray-800 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-2">
                                    <img 
                                        src={`/images/${post.user?.profile_picture || 'pp1.png'}`}
                                        alt="Profile" 
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <span className="font-bold text-white">{post.user?.username || 'User'}</span>
                                        <p className="text-sm text-gray-400">{formatTimeAgo(post.created_at)}</p>
                                    </div>
                                </div>
                                <p className="text-white mb-3">{post.content}</p>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <button className="flex items-center mr-4">
                                        <i className="fas fa-heart mr-1"></i>
                                        <span>{post.likes_count || 0} Likes</span>
                                    </button>
                                    <button className="flex items-center">
                                        <i className="fas fa-comment mr-1"></i>
                                        <span>{post.comments_count || 0} Komentar</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center">Belum ada postingan.</p>
                    )}
                </Tab.Panel>

                <Tab.Panel>
                    {comments && comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="bg-gray-800 p-4 rounded-lg mb-4">
                                <div className="mb-2">
                                    <span className="text-sm text-gray-400">
                                        Anda berkomentar pada postingan milik <strong>{comment.post?.user?.username || 'User'}</strong>
                                    </span>
                                    <p className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</p>
                                </div>
                                <div className="bg-gray-700 p-2 rounded mb-2">
                                    <p className="text-gray-300">Post: {comment.post?.content || ''}</p>
                                </div>
                                <div className="text-gray-200 border-l-4 border-blue-500 pl-3">
                                    Komentar Anda: {comment.comment}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center">Belum ada komentar.</p>
                    )}
                </Tab.Panel>

                <Tab.Panel>
                    {likes && likes.length > 0 ? (
                        likes.map(post => (
                            <div key={post.id} className="bg-gray-800 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-2">
                                    <img 
                                        src={`/images/${post.user?.profile_picture || 'pp1.png'}`}
                                        alt="Profile" 
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <span className="font-bold text-white">{post.user?.username || 'User'}</span>
                                        <p className="text-sm text-gray-400">{formatTimeAgo(post.created_at)}</p>
                                    </div>
                                </div>
                                <p className="text-white mb-3">{post.content}</p>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <button className="flex items-center mr-4">
                                        <i className="fas fa-heart mr-1 text-red-500"></i>
                                        <span>{post.likes_count || 0} Likes</span>
                                    </button>
                                    <button className="flex items-center">
                                        <i className="fas fa-comment mr-1"></i>
                                        <span>{post.comments_count || 0} Komentar</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center">Belum ada post yang disukai.</p>
                    )}
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
}
