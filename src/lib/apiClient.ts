import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getStoredToken, isTokenValid, refreshToken } from '../services/authService';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: false
});

// Add request interceptor for authentication and token refresh
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = getStoredToken();
      
      if (token) {
        if (!isTokenValid(token)) {
          // Token is expired or close to expiring, try to refresh
          const newToken = await refreshToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      toast.error('Erro de conexão com o servidor. Verifique sua internet.');
      return Promise.reject(new Error('Network Error'));
    }

    // Handle 401 errors (unauthorized)
    if (error.response.status === 401) {
      try {
        const newToken = await refreshToken();
        if (newToken) {
          // Retry the original request with new token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Handle other error statuses
    const errorMessage = error.response?.data?.message || 'Ocorreu um erro inesperado';
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default apiClient;