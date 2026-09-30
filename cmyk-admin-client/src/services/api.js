// Relative path leverages Vite's dev proxy locally & Nginx/Cloudflare in production
const API_URL = '/api';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('cmyk_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();

    if (response.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('cmyk_token');
      window.location.href = '/login';
    }

    return { status: response.status, data, error: null };
  } catch (error) {
    console.error(`[Client API Proxy Fault] ${endpoint}:`, error);
    return {
      status: 0,
      data: null,
      error: 'Backend engine unreachable. Ensure server is running on port 3000.'
    };
  }
};
