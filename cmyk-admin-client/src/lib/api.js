import axios from 'axios';

// 1. Create the base instance
export const api = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
  timeout: 5000,
});

// 2. Request Interceptor: Inject token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cmyk_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Response Interceptor: Global 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Redirecting...");
      localStorage.removeItem('cmyk_jwt');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);
