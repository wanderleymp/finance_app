import axios from 'axios';
import { API_CONFIG } from '../config/api';

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: false // Disable credentials for CORS
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Sanitize the request data for logging
    const sanitizedConfig = {
      method: config.method,
      url: config.url,
      headers: { ...config.headers },
      data: config.data
    };
    console.log('API Request:', sanitizedConfig);
    return config;
  },
  (error) => {
    const sanitizedError = {
      message: error.message,
      code: error.code
    };
    console.error('Request error:', sanitizedError);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    // Sanitize the response data for logging
    const sanitizedResponse = {
      status: response.status,
      data: response.data
    };
    console.log('API Response:', sanitizedResponse);
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Erro de conexão com o servidor. Por favor, tente novamente.'));
    }

    // Handle other errors
    const sanitizedError = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    };
    console.error('Response error:', sanitizedError);
    return Promise.reject(error);
  }
);