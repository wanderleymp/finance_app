import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { License } from '../types/license';
import { toast } from 'sonner';

// Mock data for development
const mockLicenses: License[] = [
  {
    license_id: 1,
    license_name: 'Agile Finance Basic',
    description: 'Plano básico com funcionalidades essenciais',
    price: 99.90,
    status: 'active',
    features: [
      'Gestão financeira básica',
      'Até 3 usuários',
      'Relatórios básicos'
    ],
    max_users: 3,
    duration_months: 12,
    created_at: '2024-03-01T00:00:00',
    updated_at: '2024-03-01T00:00:00'
  },
  {
    license_id: 2,
    license_name: 'Agile Finance Pro',
    description: 'Plano profissional com recursos avançados',
    price: 199.90,
    status: 'active',
    features: [
      'Todas as funcionalidades do Basic',
      'Até 10 usuários',
      'Relatórios avançados',
      'Suporte prioritário'
    ],
    max_users: 10,
    duration_months: 12,
    created_at: '2024-03-01T00:00:00',
    updated_at: '2024-03-01T00:00:00'
  }
];

export function useLicenses() {
  const queryClient = useQueryClient();

  const { data: licenses = mockLicenses, isLoading, error } = useQuery({
    queryKey: ['licenses'],
    queryFn: () => Promise.resolve(mockLicenses),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const createMutation = useMutation({
    mutationFn: (newLicense: Partial<License>) => {
      const license = {
        ...newLicense,
        license_id: Math.max(...mockLicenses.map(l => l.license_id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as License;
      mockLicenses.push(license);
      return Promise.resolve(license);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      toast.success('Licença criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar licença');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<License> }) => {
      const index = mockLicenses.findIndex(l => l.license_id === id);
      if (index === -1) throw new Error('Licença não encontrada');
      mockLicenses[index] = { 
        ...mockLicenses[index], 
        ...data,
        updated_at: new Date().toISOString()
      };
      return Promise.resolve(mockLicenses[index]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      toast.success('Licença atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar licença');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      const index = mockLicenses.findIndex(l => l.license_id === id);
      if (index === -1) throw new Error('Licença não encontrada');
      mockLicenses.splice(index, 1);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      toast.success('Licença excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir licença');
    },
  });

  return {
    licenses,
    isLoading,
    error,
    createLicense: createMutation.mutate,
    updateLicense: updateMutation.mutate,
    deleteLicense: deleteMutation.mutate,
  };
}