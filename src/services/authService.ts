import apiClient from '../lib/apiClient';
import { toast } from 'sonner';
import { API_BASE_URL } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface AuthResponse {
  token: string;
  userDetails: {
    user_id: number;
    username: string;
    person: {
      person_id: number;
      full_name: string;
      fantasy_name?: string;
      contacts: Array<{
        contact_name: string | null;
        contact_value: string;
        contact_type: string;
      }>;
    };
    permissions: {
      profile_id: number;
      permissions: Array<{
        can_access: boolean;
        feature_name: string;
        permission_id: number;
      }>;
    };
    licenses: {
      licenses: Array<{
        status: string;
        license_id: number;
        start_date: string;
        license_name: string;
      }>;
    };
  };
}

// Token refresh configuration
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiration
let refreshTokenTimeout: NodeJS.Timeout;

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // Validate credentials
    if (!credentials.identifier || !credentials.password) {
      throw new Error('E-mail e senha são obrigatórios');
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          throw new Error('Credenciais inválidas');
        case 403:
          throw new Error('Acesso não autorizado');
        case 404:
          throw new Error('Usuário não encontrado');
        case 429:
          throw new Error('Muitas tentativas. Tente novamente mais tarde');
        case 500:
          throw new Error('Erro interno do servidor');
        default:
          throw new Error(data.message || 'Erro ao realizar login');
      }
    }

    const { token, userDetails } = data;

    if (!token || !userDetails) {
      throw new Error('Resposta inválida do servidor');
    }

    // Validate token
    try {
      const decoded = jwtDecode(token);
      if (!decoded) {
        throw new Error('Token inválido');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      throw new Error('Token inválido recebido do servidor');
    }

    // Store token and user details
    localStorage.setItem('@AgileFinance:token', token);
    localStorage.setItem('@AgileFinance:user', JSON.stringify(userDetails));

    // Set up token refresh
    setupTokenRefresh(token);

    toast.success(`Bem-vindo(a), ${userDetails.person.full_name}!`);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Erro de conexão. Verifique sua internet');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro inesperado. Tente novamente mais tarde');
  }
}

export async function logout(): Promise<void> {
  try {
    const token = getStoredToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout request error:', error);
      }
    }

    // Clear token refresh timeout
    if (refreshTokenTimeout) {
      clearTimeout(refreshTokenTimeout);
    }

    // Clear stored data
    localStorage.removeItem('@AgileFinance:token');
    localStorage.removeItem('@AgileFinance:user');
    
    // Clear API client headers
    delete apiClient.defaults.headers.common.Authorization;

    toast.success('Sessão encerrada com sucesso');
  } catch (error) {
    console.error('Error during logout:', error);
    // Still clear local data even if server request fails
    localStorage.removeItem('@AgileFinance:token');
    localStorage.removeItem('@AgileFinance:user');
  }
}

export async function refreshToken(): Promise<string | null> {
  try {
    const currentToken = getStoredToken();
    if (!currentToken) {
      throw new Error('Token não disponível');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar token');
    }

    const data = await response.json();
    const { token } = data;

    if (!token) {
      throw new Error('Resposta inválida do servidor');
    }

    localStorage.setItem('@AgileFinance:token', token);

    // Set up next token refresh
    setupTokenRefresh(token);

    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await logout();
    return null;
  }
}

function setupTokenRefresh(token: string) {
  try {
    // Clear any existing refresh timeout
    if (refreshTokenTimeout) {
      clearTimeout(refreshTokenTimeout);
    }

    const decoded = jwtDecode(token);
    if (typeof decoded === 'object' && decoded !== null && 'exp' in decoded) {
      const expiresIn = (decoded.exp as number) * 1000 - Date.now();

      // Schedule token refresh
      if (expiresIn > 0) {
        refreshTokenTimeout = setTimeout(
          () => refreshToken(),
          expiresIn - TOKEN_REFRESH_THRESHOLD
        );
      }
    }
  } catch (error) {
    console.error('Error setting up token refresh:', error);
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('@AgileFinance:token');
}

export function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    if (typeof decoded === 'object' && decoded !== null && 'exp' in decoded) {
      return ((decoded.exp as number) * 1000) > (Date.now() + TOKEN_REFRESH_THRESHOLD);
    }
    return false;
  } catch {
    return false;
  }
}