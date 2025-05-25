import { useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function useAuth() {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.visit('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Verify token validity
    axios.get('/api/me')
      .then((response) => {
        // Token valid, update user data if needed
        localStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(() => {
        // Token invalid, clear storage and redirect
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        router.visit('/login');
      });
  }, []);
}
