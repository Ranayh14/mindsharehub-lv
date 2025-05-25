import { useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function useAuth() {
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // ✅ disamakan

    if (!token) {
      router.visit('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get('/api/me')
      .then((response) => {
        // User valid, bisa lanjut
      })
      .catch(() => {
        localStorage.removeItem('authToken'); // ✅ disamakan
        delete axios.defaults.headers.common['Authorization'];
        router.visit('/login');
      });
  }, []);
}
