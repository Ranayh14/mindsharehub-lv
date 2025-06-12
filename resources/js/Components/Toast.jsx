import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', show, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center transform transition-all duration-300 ease-in-out ${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 hover:text-gray-200">×</button>
        </div>
    );
}
