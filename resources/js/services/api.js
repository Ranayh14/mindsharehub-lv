import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// Auth Services
export const authService = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post('/register', userData),
    logout: () => api.post('/logout'),
    getUser: () => api.get('/me'),
};

// User Services
export const userService = {
    updateProfile: (data) => api.put('/user/profile', data),
    updatePassword: (data) => api.put('/user/password', data),
};

// Post Services
export const postService = {
    getPosts: () => api.get('/posts'),
    getPost: (id) => api.get(`/posts/${id}`),
    createPost: (data) => api.post('/posts', data),
    updatePost: (id, data) => api.put(`/posts/${id}`, data),
    deletePost: (id) => api.delete(`/posts/${id}`),
    toggleLike: (id) => api.post(`/posts/${id}/like`),
};

// Comment Services
export const commentService = {
    getComments: (postId) => api.get(`/posts/${postId}/comments`),
    createComment: (data) => api.post('/comments', data),
    updateComment: (id, data) => api.put(`/comments/${id}`, data),
    deleteComment: (id) => api.delete(`/comments/${id}`),
    toggleLike: (id) => api.post(`/comments/${id}/like`),
};

// Report Services
export const reportService = {
    createReport: (data) => api.post('/reports', data),
};

// Diary Services
export const diaryService = {
    getDiaries: () => api.get('/diaries'),
    getDiary: (id) => api.get(`/diaries/${id}`),
    createDiary: (data) => api.post('/diaries', data),
    updateDiary: (id, data) => api.put(`/diaries/${id}`, data),
    deleteDiary: (id) => api.delete(`/diaries/${id}`),
};

// Admin Services
export const adminService = {
    getUsers: () => api.get('/admin/users'),
    banUser: (userId) => api.post(`/admin/users/${userId}/ban`),
    unbanUser: (userId) => api.post(`/admin/users/${userId}/unban`),
    getContent: () => api.get('/admin/content'),
    publishContent: (contentId) => api.post(`/admin/content/${contentId}/publish`),
    unpublishContent: (contentId) => api.post(`/admin/content/${contentId}/unpublish`),
    getReports: () => api.get('/admin/reports'),
    resolveReport: (reportId, data) => api.put(`/admin/reports/${reportId}/resolve`, data),
};

// Preferences Services
export const preferenceService = {
    setDarkMode: (isDark) => api.post('/preferences/dark-mode', { darkMode: isDark }),
};

export default api; 