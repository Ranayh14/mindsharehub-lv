import React from 'react';
import { Head } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import { useDarkMode } from '../../Contexts/DarkModeContext';

export default function Report({ reports = [], commentReports = [] }) {
    const { darkMode } = useDarkMode();

    return (
        <>
            <Head title="Laporan Pengguna" />
            <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-[#202225]' : 'bg-gray-50'}`}>
                <AdminSidebar darkMode={darkMode} />
                <main className="flex-1 p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Laporan Pengguna</h2>
                    <div className="mb-10">
                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Report Postingan</h3>
                        <div className="overflow-x-auto rounded-xl shadow-sm border mb-8 transition-colors duration-200 "
                            style={{background: darkMode ? '#36393f' : 'white', borderColor: darkMode ? '#202225' : '#e5e7eb'}}>
                            <table className="w-full">
                                <thead>
                                    <tr className={darkMode ? 'bg-[#2f3136] text-gray-200' : 'bg-gray-100 text-gray-700'}>
                                        <th className="py-3 px-4 text-left">Pelapor</th>
                                        <th className="py-3 px-4 text-left">Dilaporkan</th>
                                        <th className="py-3 px-4 text-left">Alasan</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                        <th className="py-3 px-4 text-left">Tanggal</th>
                                        <th className="py-3 px-4 text-left">Konten</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.length === 0 && (
                                        <tr><td colSpan={6} className="text-center py-4 text-gray-400">Tidak ada report postingan.</td></tr>
                                    )}
                                    {reports.map((report) => (
                                        <tr key={report.id} className={darkMode ? 'border-b border-[#202225]' : 'border-b border-gray-100'}>
                                            <td className="py-3 px-4">{report.reporter?.username || '-'}</td>
                                            <td className="py-3 px-4">{report.reported_user?.username || '-'}</td>
                                            <td className="py-3 px-4">{report.reason || '-'}</td>
                                            <td className="py-3 px-4">{report.status}</td>
                                            <td className="py-3 px-4">{new Date(report.created_at).toLocaleString('id-ID')}</td>
                                            <td className="py-3 px-4 max-w-xs truncate">{report.content}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Report Komentar</h3>
                        <div className="overflow-x-auto rounded-xl shadow-sm border transition-colors duration-200 "
                            style={{background: darkMode ? '#36393f' : 'white', borderColor: darkMode ? '#202225' : '#e5e7eb'}}>
                            <table className="w-full">
                                <thead>
                                    <tr className={darkMode ? 'bg-[#2f3136] text-gray-200' : 'bg-gray-100 text-gray-700'}>
                                        <th className="py-3 px-4 text-left">Pelapor</th>
                                        <th className="py-3 px-4 text-left">Komentar</th>
                                        <th className="py-3 px-4 text-left">Alasan</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                        <th className="py-3 px-4 text-left">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentReports.length === 0 && (
                                        <tr><td colSpan={5} className="text-center py-4 text-gray-400">Tidak ada report komentar.</td></tr>
                                    )}
                                    {commentReports.map((report) => (
                                        <tr key={report.id} className={darkMode ? 'border-b border-[#202225]' : 'border-b border-gray-100'}>
                                            <td className="py-3 px-4">{report.user?.username || '-'}</td>
                                            <td className="py-3 px-4 max-w-xs truncate">{report.comment?.content || '-'}</td>
                                            <td className="py-3 px-4">{report.reason || '-'}</td>
                                            <td className="py-3 px-4">{report.status}</td>
                                            <td className="py-3 px-4">{new Date(report.created_at).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
