import { useState } from 'react';
import { diaryService } from '@/services/api';

const MOODS = ['happy', 'sad', 'angry', 'neutral'];

export default function DiaryForm({ onSuccess }) {
    const [form, setForm] = useState({
        title: '',
        content: '',
        mood: 'neutral',
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        if (!tagInput.trim()) return;

        setForm(prev => ({
            ...prev,
            tags: [...new Set([...prev.tags, tagInput.trim()])]
        }));
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await diaryService.createDiary(form);
            setForm({
                title: '',
                content: '',
                mood: 'neutral',
                tags: [],
            });
            onSuccess?.(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create diary entry');
            console.error('Error creating diary:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mood
                </label>
                <div className="flex gap-3">
                    {MOODS.map(mood => (
                        <label key={mood} className="flex items-center">
                            <input
                                type="radio"
                                name="mood"
                                value={mood}
                                checked={form.mood === mood}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="capitalize">{mood}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map(tag => (
                        <span
                            key={tag}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                    >
                        Add
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Save Entry'}
            </button>
        </form>
    );
} 