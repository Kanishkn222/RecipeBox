import axios from 'axios';

// Create an Axios instance pointing to the backend server
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://recipebox-0xeq.onrender.com/api',
  withCredentials: true, // Enables browser to store and send HTTP-Only cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
