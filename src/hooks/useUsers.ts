import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser, User } from '../services/userService';
import { handleError } from '../utils/errorHandler';
import { toast } from 'sonner';
import { IS_DEMO } from '../utils/constants';
import { mockUsers } from '../mocks/users';

export function useUsers() {
  const queryClient = useQueryClient();

  // Busca de usuários
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: IS_DEMO ? () => Promise.resolve(mockUsers) : getUsers,
    staleTime: IS_DEMO ? Infinity : 0,
    cacheTime: IS_DEMO ? Infinity : 5 * 60 * 1000, // 5 minutos
    retry: 2,
    onError: (error: unknown) => handleError(error, 'Erro ao carregar usuários'),
  });


  
  // Mutação para criar usuário
  const createMutation = useMutation<User, unknown, Partial<User>>({
    mutationFn: IS_DEMO
      ? (data) => {
          const user = {
            ...data,
            id: Math.max(...mockUsers.map(u => u.id)) + 1,
          } as User;
          mockUsers.push(user);
          return Promise.resolve(user);
        }
      : createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error: unknown) => handleError(error, 'Erro ao criar usuário'),
  });

  // Mutação para atualizar usuário
  const updateMutation = useMutation<User, unknown, { id: number; data: Partial<User> }>({
    mutationFn: IS_DEMO
      ? ({ id, data }) => {
          const index = mockUsers.findIndex(u => u.id === id);
          if (index === -1) throw new Error('Usuário não encontrado');
          mockUsers[index] = { ...mockUsers[index], ...data };
          return Promise.resolve(mockUsers[index]);
        }
      : ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (error: unknown) => handleError(error, 'Erro ao atualizar usuário'),
  });

  // Mutação para excluir usuário
  const deleteMutation = useMutation<void, unknown, number>({
    mutationFn: IS_DEMO
      ? (id) => {
          const index = mockUsers.findIndex(u => u.id === id);
          if (index === -1) throw new Error('Usuário não encontrado');
          mockUsers.splice(index, 1);
          return Promise.resolve();
        }
      : deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Usuário excluído com sucesso!');
    },
    onError: (error: unknown) => handleError(error, 'Erro ao excluir usuário'),
  });

  return {
    users,
    isLoading,
    error,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isDemo: IS_DEMO,
  };
}
