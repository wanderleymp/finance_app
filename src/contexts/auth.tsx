import { createContext, ReactNode, useCallback, useState } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

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
  email: string;
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
  const [data, setData] = useState<AuthState>(() => {
    try {
      const token = localStorage.getItem('@AgileFinance:token');
      const user = localStorage.getItem('@AgileFinance:user');

      if (token && user) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        return { token, user: JSON.parse(user) };
      }
    } catch (error) {
      localStorage.removeItem('@AgileFinance:token');
      localStorage.removeItem('@AgileFinance:user');
      console.error('Error loading auth state:', error);
    }

    return {} as AuthState;
  });

  const hasPermission = useCallback((featureName: string): boolean => {
    if (!data.user?.permissions?.permissions) return false;
    
    const permission = data.user.permissions.permissions.find(
      (p) => p.feature_name === featureName
    );
    
    return permission?.can_access ?? false;
  }, [data.user]);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    try {
      // Mock successful login for development
      const mockResponse = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        userDetails: {
          user_id: 6,
          username: "Wanderley Pinheiro",
          person: {
            person_id: 2,
            full_name: "Wanderley Macedo",
            fantasy_name: "Wanderley Macedo Pinheiro Junior",
            contacts: [
              {
                contact_name: null,
                contact_value: "wanderley@agilegestao.com",
                contact_type: "E-Mail"
              }
            ]
          },
          permissions: {
            profile_id: 1,
            permissions: [
              {
                can_access: true,
                feature_name: "view_dashboard",
                permission_id: 1
              }
            ]
          },
          licenses: {
            licenses: [
              {
                status: "Ativa",
                license_id: 1,
                start_date: "2024-09-10",
                license_name: "AGILE"
              }
            ]
          }
        }
      };

      // Store mock data
      const { token, userDetails } = mockResponse;
      localStorage.setItem('@AgileFinance:token', token);
      localStorage.setItem('@AgileFinance:user', JSON.stringify(userDetails));

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setData({ token, user: userDetails });

      toast.success(`Bem-vindo(a), ${userDetails.person.full_name}!`);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message || 'Erro ao fazer login'
        : 'Erro inesperado ao fazer login';
      
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@AgileFinance:token');
    localStorage.removeItem('@AgileFinance:user');
    delete api.defaults.headers.common.Authorization;
    setData({} as AuthState);
  }, []);

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