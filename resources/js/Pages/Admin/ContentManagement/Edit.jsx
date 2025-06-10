import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Edit({ content }) {
    const { darkMode } = useDarkMode();
    const [imagePreview, setImagePreview] = useState(content.image_path ? `/storage/${content.image_path}` : null);

    // Update imagePreview when content.image_path changes (e.g., after successful update)
    useEffect(() => {
        setImagePreview(content.image_path ? `/storage/${content.image_path}` : null);
    }, [content.image_path]);

    const { data, setData, put, processing, errors } = useForm({
        title: content.title || '',
        content: content.content || '',
        image: null,
        is_published: content.is_published,
        send_notification: content.send_notification,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = { ...data, _method: 'put' };

        // Explicitly handle image field based on user interaction
        if (data.image) {
            // New image selected, data.image is already a File object
            // No change needed, Inertia will handle it as multipart/form-data
        } else if (imagePreview === null && content.image_path) {
            // User removed the existing image, send null to backend to clear it
            submitData.image = null;
        } else {
            // No new image selected, and existing image was not removed.
            // Do not send the 'image' field at all, to avoid unnecessary validation or modification.
            delete submitData.image;
        }

        put(route('admin.content.update', content.id), submitData, {
            forceFormData: true,
            onSuccess: () => {
                // Clear the file input after successful upload/update
                setData('image', null);
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#36393f]' : 'bg-gray-50'}`}>
            <Head title="Edit Content" />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                            Edit Content: {content.title}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} p-6 rounded-xl shadow-lg border ${darkMode ? 'border-[#202225]' : 'border-gray-100'}`}>
                                {/* Title Input */}
                                <div className="mb-4">
                                    <label htmlFor="title" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-700'}`}>
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-[#40444b] border-[#202225] text-[#DCDDDE]' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                </div>

                                {/* Content Input */}
                                <div className="mb-4">
                                    <label htmlFor="content" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-700'}`}>
                                        Content
                                    </label>
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        rows={6}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-[#40444b] border-[#202225] text-[#DCDDDE]' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                                </div>

                                {/* Image Upload */}
                                <div className="mb-4">
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-700'}`}>
                                        Image
                                    </label>
                                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${darkMode ? 'border-[#40444b]' : 'border-gray-300'}`}>
                                        <div className="space-y-1 text-center">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="mx-auto h-32 w-auto rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faImage}
                                                        className={`mx-auto h-12 w-12 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-400'}`}
                                                    />
                                                    <div className="flex text-sm">
                                                        <label
                                                            htmlFor="image-upload"
                                                            className={`relative cursor-pointer rounded-md font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} hover:text-indigo-500`}
                                                        >
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="image-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                onChange={handleImageChange}
                                                                accept="image/*"
                                                            />
                                                        </label>
                                                    </div>
                                                    <p className={`text-xs ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-500'}`}>
                                                        PNG, JPG, GIF up to 2MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                                </div>

                                {/* Options */}
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={e => setData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <span className={`ml-2 text-sm ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-700'}`}>
                                            Publish immediately
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.send_notification}
                                            onChange={e => setData('send_notification', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <span className={`ml-2 text-sm ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-700'}`}>
                                            Send notification to users
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-6 py-2 rounded-lg text-white font-medium ${
                                        processing
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    } transition-colors duration-200`}
                                >
                                    {processing ? 'Updating...' : 'Update Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
