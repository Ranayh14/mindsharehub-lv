import axios from 'axios';

const token = localStorage.getItem('authToken');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;
