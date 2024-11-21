import { createContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout, getStoredToken, isTokenValid } from '../services/authService';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { IS_DEMO } from '../utils/constants';
import { mockAuthResponse } from '../mocks/auth';
import { handleError } from '../utils/errorHandler';
import apiClient from '../lib/apiClient';

interface User {
  user_id: number;
  username: string;
  person: {
    full_name: string;
    fantasy_name?: string;
    contacts: Array<{
      contact_type: string;
      contact_value: string;
      contact_name: string | null;
    }>;
  };
  permissions: {
    permissions: Array<{
      feature_name: string;
      can_access: boolean;
    }>;
  };
  licenses: {
    licenses: Array<{
      license_id: number;
      license_name: string;
      status: string;
      start_date: string;
    }>;
  };
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  identifier: string;
  password: string;
}

interface AuthContextData {
  user: User;
  isAuthenticated: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  hasPermission(featureName: string): boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [data, setData] = useState<AuthState>(() => {
    try {
      const token = getStoredToken();
      const user = localStorage.getItem('@AgileFinance:user');

      if (token && user && isTokenValid(token)) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
        return { token, user: JSON.parse(user) };
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }

    return {} as AuthState;
  });

  useEffect(() => {
    // Check token validity periodically
    const checkTokenInterval = setInterval(() => {
      const token = getStoredToken();
      if (token && !isTokenValid(token)) {
        signOut();
        navigate('/login');
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTokenInterval);
  }, [navigate]);

  const hasPermission = useCallback((featureName: string): boolean => {
    if (!data.user?.permissions?.permissions) return false;
    
    const permission = data.user.permissions.permissions.find(
      (p) => p.feature_name === featureName
    );
    
    return permission?.can_access ?? false;
  }, [data.user]);

  const signIn = useCallback(async ({ identifier, password }: SignInCredentials) => {
    try {
      let response;

      if (IS_DEMO) {
        response = mockAuthResponse;
      } else {
        response = await login({ identifier, password });
      }

      const { token, userDetails } = response;

      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      setData({ token, user: userDetails });

      toast.success(`Bem-vindo(a), ${userDetails.person.full_name}!`);
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || 'Credenciais inválidas';
        toast.error(message);
      } else {
        handleError(error);
      }
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
      setData({} as AuthState);
      navigate('/login');
    } catch (error) {
      handleError(error);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        isAuthenticated: !!data.user,
        signIn,
        signOut,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}