import { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function useAuth() {
  const [isChecking, setIsChecking] = useState(true);

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

    axios.get('/api/me')
      .then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data));
        setIsChecking(false);
      })
      .catch(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        router.visit('/login');
      });
  }, []);

  return { isChecking };
}
