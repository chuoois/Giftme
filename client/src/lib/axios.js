import axios from 'axios';

const baseURL = import.meta.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : '/api';

const api = axios.create({
  baseURL: 'baseURL',
  headers: {
    'Content-Type': 'application/json',
    
  },
});

export default api;