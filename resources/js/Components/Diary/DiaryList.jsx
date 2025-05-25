import { useState, useEffect } from 'react';
import { diaryService } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function DiaryList() {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDiaries();
    }, []);

    const loadDiaries = async () => {
        try {
            const response = await diaryService.getDiaries();
            setDiaries(response.data);
        } catch (error) {
            setError('Failed to load diaries');
            console.error('Error loading diaries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (diaryId) => {
        if (!confirm('Are you sure you want to delete this diary entry?')) return;

        try {
            await diaryService.deleteDiary(diaryId);
            setDiaries(prev => prev.filter(diary => diary.id !== diaryId));
        } catch (error) {
            console.error('Error deleting diary:', error);
            alert('Failed to delete diary entry');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (diaries.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No diary entries yet. Start writing your thoughts!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {diaries.map(diary => (
                <div key={diary.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {diary.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(diary.created_at), { addSuffix: true, locale: id })}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(diary)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-edit" />
                            </button>
                            <button
                                onClick={() => handleDelete(diary.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <i className="fas fa-trash" />
                            </button>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {diary.content}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            diary.mood === 'happy' ? 'bg-green-100 text-green-800' :
                            diary.mood === 'sad' ? 'bg-blue-100 text-blue-800' :
                            diary.mood === 'angry' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {diary.mood}
                        </span>
                        {diary.tags?.map(tag => (
                            <span
                                key={tag}
                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
} 