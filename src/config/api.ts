export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://api.agilefinance.com.br:3000',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      forgotPassword: '/auth/forgot-password',
    },
  },
};