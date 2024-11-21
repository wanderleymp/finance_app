import apiClient from '../lib/apiClient';
import { Movement } from '../types/movement';
import { handleError } from '../utils/errorHandler';

interface MovementsResponse {
  data: Movement[];
  total: number;
  page: number;
  totalPages: number;
}

interface MovementFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export async function listMovements(filters: MovementFilters = {}): Promise<MovementsResponse> {
  try {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);

    const response = await apiClient.get<MovementsResponse>(`/movements?${params.toString()}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao carregar movimentos');
    throw error;
  }
}

export async function getMovement(id: number): Promise<Movement> {
  try {
    const response = await apiClient.get<Movement>(`/movements/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao carregar movimento');
    throw error;
  }
}

export async function createMovement(data: Partial<Movement>): Promise<Movement> {
  try {
    const response = await apiClient.post<Movement>('/movements', data);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao criar movimento');
    throw error;
  }
}

export async function updateMovement(id: number, data: Partial<Movement>): Promise<Movement> {
  try {
    const response = await apiClient.put<Movement>(`/movements/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao atualizar movimento');
    throw error;
  }
}

export async function cancelMovement(id: number): Promise<void> {
  try {
    await apiClient.post(`/movements/${id}/cancel`);
  } catch (error) {
    handleError(error, 'Erro ao cancelar movimento');
    throw error;
  }
}

export async function generateInvoice(id: number): Promise<void> {
  try {
    await apiClient.post(`/movements/${id}/invoice`);
  } catch (error) {
    handleError(error, 'Erro ao gerar nota fiscal');
    throw error;
  }
}

export async function generateBankSlip(id: number): Promise<void> {
  try {
    await apiClient.post(`/movements/${id}/bank-slip`);
  } catch (error) {
    handleError(error, 'Erro ao gerar boleto');
    throw error;
  }
}

export async function sendNotification(id: number, type: 'email' | 'whatsapp', notificationType: 'billing' | 'installment'): Promise<void> {
  try {
    await apiClient.post(`/movements/${id}/notify`, {
      type,
      notificationType
    });
  } catch (error) {
    handleError(error, 'Erro ao enviar notificação');
    throw error;
  }
}