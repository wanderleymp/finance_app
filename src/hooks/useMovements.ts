import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Movement } from '../types/movement';
import { toast } from 'sonner';
import { 
  listMovements,
  createMovement,
  updateMovement,
  cancelMovement,
  generateInvoice,
  generateBankSlip,
  sendNotification
} from '../services/movementService';

interface UseMovementsFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export function useMovements(filters: UseMovementsFilters = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['movements', filters],
    queryFn: () => listMovements(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Movement>) => createMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['movements']);
      toast.success('Movimento criado com sucesso!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Movement> }) => 
      updateMovement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['movements']);
      toast.success('Movimento atualizado com sucesso!');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelMovement(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['movements']);
      toast.success('Movimento cancelado com sucesso!');
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: (id: number) => generateInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['movements']);
      toast.success('Nota fiscal gerada com sucesso!');
    },
  });

  const generateBankSlipMutation = useMutation({
    mutationFn: (id: number) => generateBankSlip(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['movements']);
      toast.success('Boleto gerado com sucesso!');
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: ({ id, type, notificationType }: { 
      id: number; 
      type: 'email' | 'whatsapp';
      notificationType: 'billing' | 'installment';
    }) => sendNotification(id, type, notificationType),
    onSuccess: () => {
      toast.success('Notificação enviada com sucesso!');
    },
  });

  return {
    movements: data?.data || [],
    total: data?.total || 0,
    currentPage: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    createMovement: createMutation.mutate,
    updateMovement: updateMutation.mutate,
    cancelMovement: cancelMutation.mutate,
    generateInvoice: generateInvoiceMutation.mutate,
    generateBankSlip: generateBankSlipMutation.mutate,
    sendNotification: sendNotificationMutation.mutate,
  };
}