import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useDarkMode } from '@/Contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faUserPlus,
    faExclamationCircle,
    faCheckCircle,
    faEye,
    faSun,
    faMoon
} from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Admin({ auth, stats }) {
    const { darkMode, toggleDarkMode } = useDarkMode();

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Postingan Bulanan',
                data: stats?.monthlyPosts || Array(12).fill(0),
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Total Pengguna Bulanan',
                data: stats?.monthlyUsers || Array(12).fill(0),
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: darkMode ? '#B9BBBE' : '#6B7280'
                }
            },
            x: {
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: darkMode ? '#B9BBBE' : '#6B7280'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: darkMode ? '#DCDDDE' : '#374151',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Admin Dashboard" />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                        Hallo! {auth.user.name}
                    </h2>
                    <p className={`mt-1 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>
                        Selamat datang di dashboard admin
                    </p>
                </div>
                <button
                    onClick={toggleDarkMode}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                        darkMode
                            ? 'bg-[#2f3136] text-yellow-400 hover:bg-[#36393f]'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <FontAwesomeIcon
                        icon={darkMode ? faSun : faMoon}
                        className="w-5 h-5"
                    />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Users */}
                <div className="group bg-gradient-to-br from-[#5865F2] to-[#3b4c8f] p-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-100 text-sm font-medium">Total Pengguna</h3>
                        <span className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-white" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-0.5">{stats?.totalPengguna || 0}</p>
                    <p className="text-xs text-gray-200 opacity-80">Total pengguna terdaftar</p>
                </div>

                {/* New Users */}
                <div className="group bg-gradient-to-br from-[#3b82f6] to-[#1e40af] p-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-100 text-sm font-medium">Pengguna Baru</h3>
                        <span className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 text-white" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-0.5">{stats?.totalPenggunaBaru || 0}</p>
                    <p className="text-xs text-gray-200 opacity-80">Pengguna baru bulan ini</p>
                </div>

                {/* Pending Reports */}
                <div className="group bg-gradient-to-br from-[#f04747] to-[#d32f2f] p-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-100 text-sm font-medium">Laporan Menunggu</h3>
                        <span className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-white" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-0.5">{stats?.totalWaitingReports || 0}</p>
                    <p className="text-xs text-gray-200 opacity-80">Laporan yang belum ditangani</p>
                </div>

                {/* Solved Issues */}
                <div className="group bg-gradient-to-br from-[#34D399] to-[#059669] p-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-100 text-sm font-medium">Masalah Terselesaikan</h3>
                        <span className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-white" />
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-0.5">{stats?.totalSolvedIssues || 0}</p>
                    <p className="text-xs text-gray-200 opacity-80">Masalah yang sudah diselesaikan</p>
                </div>
            </div>

            {/* Activity Chart */}
            <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 border ${darkMode ? 'border-[#202225]' : 'border-gray-100'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                    Grafik Aktivitas
                </h3>
                <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Recent Posts */}
            <div className={`${darkMode ? 'bg-[#2f3136]' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-[#202225]' : 'border-gray-100'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                    Postingan Terbaru
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`border-b ${darkMode ? 'border-[#202225]' : 'border-gray-100'}`}>
                                <th className={`pb-3 px-4 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'} font-medium`}>
                                    Konten
                                </th>
                                <th className={`pb-3 px-4 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'} font-medium`}>
                                    Username
                                </th>
                                <th className={`pb-3 px-4 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'} font-medium`}>
                                    Tanggal
                                </th>
                                <th className={`pb-3 px-4 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'} font-medium text-center`}>
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                                stats.recentPosts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className={`border-b last:border-b-0 ${darkMode ? 'border-[#202225] hover:bg-[#36393f]' : 'border-gray-100 hover:bg-gray-50'} transition-colors duration-200`}
                                    >
                                        <td className={`py-4 px-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                                            <div className="line-clamp-2">
                                                {post.content}
                                            </div>
                                        </td>
                                        <td className={`py-4 px-4 ${darkMode ? 'text-[#DCDDDE]' : 'text-gray-800'}`}>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#4f545c]' : 'bg-gray-200'}`}>
                                                    <span className="text-sm font-medium">
                                                        {post.username ? post.username.charAt(0).toUpperCase() : '?'}
                                                    </span>
                                                </div>
                                                <span className="font-medium">{post.username || 'Unknown User'}</span>
                                            </div>
                                        </td>
                                        <td className={`py-4 px-4 ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>
                                            {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <a
                                                href="#"
                                                className={`text-indigo-600 hover:text-indigo-900 ${darkMode ? 'dark:text-indigo-400 dark:hover:text-indigo-300' : ''}`}
                                            >
                                                <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className={`py-4 px-4 text-center ${darkMode ? 'text-[#B9BBBE]' : 'text-gray-600'}`}>
                                        Tidak ada postingan terbaru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
