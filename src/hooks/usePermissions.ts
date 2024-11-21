import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPermissions, 
  getUserPermissions, 
  updateUserPermissions,
  createPermission,
  updatePermission,
  deletePermission
} from '../services/permissionService';
import { handleError } from '../utils/errorHandler';
import { toast } from 'sonner';
import { IS_DEMO } from '../utils/constants';
import { mockPermissions } from '../mocks/permissions';

export function usePermissions() {
  const queryClient = useQueryClient();

  const { data: permissions = [], isLoading, error } = useQuery({
    queryKey: ['permissions'],
    queryFn: IS_DEMO ? () => Promise.resolve(mockPermissions) : getPermissions,
    staleTime: IS_DEMO ? Infinity : 0,
    cacheTime: IS_DEMO ? Infinity : 5 * 60 * 1000,
    retry: 2,
    onError: (error) => handleError(error, 'Erro ao carregar permissões'),
  });

  const createMutation = useMutation({
    mutationFn: IS_DEMO 
      ? (data: Partial<Permission>) => {
          const permission = {
            ...data,
            permission_id: Math.max(...mockPermissions.map(p => p.permission_id)) + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Permission;
          mockPermissions.push(permission);
          return Promise.resolve(permission);
        }
      : createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permissão criada com sucesso!');
    },
    onError: (error) => handleError(error, 'Erro ao criar permissão'),
  });

  const updateMutation = useMutation({
    mutationFn: IS_DEMO
      ? ({ id, data }: { id: number; data: Partial<Permission> }) => {
          const index = mockPermissions.findIndex(p => p.permission_id === id);
          if (index === -1) throw new Error('Permissão não encontrada');
          mockPermissions[index] = { 
            ...mockPermissions[index], 
            ...data,
            updated_at: new Date().toISOString()
          };
          return Promise.resolve(mockPermissions[index]);
        }
      : ({ id, data }) => updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permissão atualizada com sucesso!');
    },
    onError: (error) => handleError(error, 'Erro ao atualizar permissão'),
  });

  const deleteMutation = useMutation({
    mutationFn: IS_DEMO
      ? (id: number) => {
          const index = mockPermissions.findIndex(p => p.permission_id === id);
          if (index === -1) throw new Error('Permissão não encontrada');
          mockPermissions.splice(index, 1);
          return Promise.resolve();
        }
      : deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permissão excluída com sucesso!');
    },
    onError: (error) => handleError(error, 'Erro ao excluir permissão'),
  });

  return {
    permissions,
    isLoading,
    error,
    createPermission: createMutation.mutate,
    updatePermission: updateMutation.mutate,
    deletePermission: deleteMutation.mutate,
    isDemo: IS_DEMO,
  };
}

export function useUserPermissions(userId: number) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userPermissions', userId],
    queryFn: IS_DEMO 
      ? () => Promise.resolve({
          profile_id: 1,
          permissions: mockPermissions.map(p => ({
            ...p,
            can_access: Math.random() > 0.5
          }))
        })
      : () => getUserPermissions(userId),
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: IS_DEMO
      ? (permissions: Permission[]) => Promise.resolve({ profile_id: 1, permissions })
      : (permissions: Permission[]) => updateUserPermissions(userId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      toast.success('Permissões atualizadas com sucesso!');
    },
    onError: (error) => handleError(error, 'Erro ao atualizar permissões'),
  });

  return {
    userPermissions: data,
    isLoading,
    error,
    updateUserPermissions: updateMutation.mutate,
  };
}