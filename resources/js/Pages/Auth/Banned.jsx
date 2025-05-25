import React from 'react';
import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

export default function Banned({ reason }) {
    return (
        <>
            <Head title="Akun Dinonaktifkan" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <FontAwesomeIcon
                            icon={faBan}
                            className="w-16 h-16 text-red-500 mx-auto"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Akun Dinonaktifkan
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Mohon maaf, akun Anda telah dinonaktifkan.
                        {reason && (
                            <span className="block mt-2">
                                Alasan: {reason}
                            </span>
                        )}
                    </p>
                    <p className="text-sm text-gray-500">
                        Jika Anda merasa ini adalah kesalahan, silakan hubungi tim support kami
                        melalui email support@mindsharehub.com
                    </p>
                </div>
            </div>
        </>
    );
}
