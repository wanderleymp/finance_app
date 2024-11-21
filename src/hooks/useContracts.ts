import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Contract, ContractStatus } from '../types/contract';
import { toast } from 'sonner';
import { IS_DEMO } from '../utils/constants';

// Mock data for development
const mockContracts: Contract[] = [
  {
    contract_id: 1,
    contract_name: 'Contrato de Manutenção - Cliente A',
    contract_value: 1500.00,
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'ATIVO',
    next_billing_date: '2024-04-01',
    due_day: 5,
    recurrence_period: 'MENSAL',
    contract_group_id: 1,
    person_id: 1,
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00',
    adjustments: [],
    extra_services: [],
    billing_logs: []
  },
  {
    contract_id: 2,
    contract_name: 'Contrato de Consultoria - Cliente B',
    contract_value: 3000.00,
    start_date: '2024-02-01',
    end_date: '2025-01-31',
    status: 'ATIVO',
    next_billing_date: '2024-04-01',
    due_day: 10,
    recurrence_period: 'MENSAL',
    contract_group_id: 2,
    person_id: 2,
    created_at: '2024-02-01T00:00:00',
    updated_at: '2024-02-01T00:00:00',
    adjustments: [],
    extra_services: [],
    billing_logs: []
  }
];

interface UseContractsFilters {
  status?: ContractStatus;
  startDate?: string;
  endDate?: string;
  groupId?: number;
  search?: string;
}

export function useContracts(filters: UseContractsFilters = {}) {
  const queryClient = useQueryClient();

  const filterContracts = (contracts: Contract[]) => {
    return contracts.filter(contract => {
      if (filters.status && contract.status !== filters.status) return false;
      if (filters.startDate && contract.start_date < filters.startDate) return false;
      if (filters.endDate && contract.end_date > filters.endDate) return false;
      if (filters.groupId && contract.contract_group_id !== filters.groupId) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return contract.contract_name.toLowerCase().includes(searchTerm);
      }
      return true;
    });
  };

  const { data: contracts = [], isLoading, error } = useQuery({
    queryKey: ['contracts', filters],
    queryFn: () => Promise.resolve(filterContracts(mockContracts)),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const createMutation = useMutation({
    mutationFn: (newContract: Partial<Contract>) => {
      const contract = {
        ...newContract,
        contract_id: Math.max(...mockContracts.map(c => c.contract_id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        adjustments: [],
        extra_services: [],
        billing_logs: []
      } as Contract;
      mockContracts.push(contract);
      return Promise.resolve(contract);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contrato criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar contrato');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Contract> }) => {
      const index = mockContracts.findIndex(c => c.contract_id === id);
      if (index === -1) throw new Error('Contrato não encontrado');
      mockContracts[index] = { 
        ...mockContracts[index], 
        ...data,
        updated_at: new Date().toISOString()
      };
      return Promise.resolve(mockContracts[index]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contrato atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar contrato');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => {
      const index = mockContracts.findIndex(c => c.contract_id === id);
      if (index === -1) throw new Error('Contrato não encontrado');
      mockContracts[index] = {
        ...mockContracts[index],
        status: 'CANCELADO',
        updated_at: new Date().toISOString()
      };
      return Promise.resolve(mockContracts[index]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contrato cancelado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cancelar contrato');
    },
  });

  const addExtraService = async (contractId: number, service: Partial<ExtraService>) => {
    const contract = mockContracts.find(c => c.contract_id === contractId);
    if (!contract) throw new Error('Contrato não encontrado');

    const newService = {
      ...service,
      service_id: Math.max(...contract.extra_services.map(s => s.service_id), 0) + 1,
      contract_id: contractId,
      status: 'PENDENTE',
      created_at: new Date().toISOString()
    } as ExtraService;

    contract.extra_services.push(newService);
    queryClient.invalidateQueries({ queryKey: ['contracts'] });
    toast.success('Serviço extra adicionado com sucesso!');
  };

  const addAdjustment = async (contractId: number, adjustment: Partial<ContractAdjustment>) => {
    const contract = mockContracts.find(c => c.contract_id === contractId);
    if (!contract) throw new Error('Contrato não encontrado');

    const newAdjustment = {
      ...adjustment,
      adjustment_id: Math.max(...contract.adjustments.map(a => a.adjustment_id), 0) + 1,
      contract_id: contractId,
      created_at: new Date().toISOString()
    } as ContractAdjustment;

    contract.adjustments.push(newAdjustment);
    queryClient.invalidateQueries({ queryKey: ['contracts'] });
    toast.success('Ajuste adicionado com sucesso!');
  };

  const generateBilling = async (contractId: number) => {
    const contract = mockContracts.find(c => c.contract_id === contractId);
    if (!contract) throw new Error('Contrato não encontrado');

    if (contract.status !== 'ATIVO') {
      throw new Error('Apenas contratos ativos podem ser faturados');
    }

    const newLog = {
      log_id: Math.max(...contract.billing_logs.map(l => l.log_id), 0) + 1,
      contract_id: contractId,
      movement_id: Math.floor(Math.random() * 1000), // Mock movement ID
      billing_date: new Date().toISOString(),
      amount: contract.contract_value,
      status: 'SUCESSO',
      created_at: new Date().toISOString()
    };

    contract.billing_logs.push(newLog);
    queryClient.invalidateQueries({ queryKey: ['contracts'] });
    toast.success('Faturamento gerado com sucesso!');
  };

  return {
    contracts,
    isLoading,
    error,
    createContract: createMutation.mutate,
    updateContract: updateMutation.mutate,
    cancelContract: cancelMutation.mutate,
    addExtraService,
    addAdjustment,
    generateBilling,
    isDemo: IS_DEMO,
  };
}