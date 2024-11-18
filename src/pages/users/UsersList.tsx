import { useState } from 'react';
import { 
  UserPlus, 
  Search,
  Share2,
  Filter,
  SlidersHorizontal,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ViewToggle } from '../../components/users/ViewToggle';
import { UserCard } from '../../components/users/UserCard';
import { ExportButton } from '../../components/users/ExportButton';
import { User } from '../../types/user';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Wanderley Pinheiro',
    email: 'wanderley@agilegestao.com',
    role: 'Administrador',
    status: 'active',
    lastAccess: '2024-03-10T15:30:00',
  },
  {
    id: 2,
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    role: 'Usuário',
    status: 'active',
    lastAccess: '2024-03-09T10:15:00',
  },
  {
    id: 3,
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    role: 'Gerente',
    status: 'inactive',
    lastAccess: '2024-03-08T14:20:00',
  },
];

export function UsersList() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const lastAccessDate = new Date(Math.max(...users.map(u => new Date(u.lastAccess).getTime())));

  const metrics = [
    { name: 'Total de Usuários', value: users.length, icon: UsersIcon, color: 'indigo' },
    { name: 'Usuários Ativos', value: activeUsers, icon: UserCheck, color: 'green' },
    { name: 'Usuários Inativos', value: inactiveUsers, icon: UserX, color: 'red' },
    { 
      name: 'Último Acesso', 
      value: lastAccessDate.toLocaleString('pt-BR', { 
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }), 
      icon: Clock,
      color: 'blue'
    },
  ];

  const handleEdit = (user: User) => {
    toast.info('Função de edição em desenvolvimento');
  };

  const handleDelete = (user: User) => {
    toast.error(`Confirma exclusão do usuário ${user.name}?`, {
      action: {
        label: 'Confirmar',
        onClick: () => {
          setUsers(users.filter(u => u.id !== user.id));
          toast.success('Usuário excluído com sucesso');
        },
      },
    });
  };

  const handleStatusChange = (user: User, newStatus: 'active' | 'inactive') => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    toast.success(`Status do usuário alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            Usuários
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-tight">
            Gerencie os usuários do sistema
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButton users={users} />
          <button
            onClick={() => toast.info('Função em desenvolvimento')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-${metric.color}-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                </div>
                <Icon className={`h-8 w-8 text-${metric.color}-500`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10 rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
          </button>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4"
        >
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Filtros
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm">
              <option value="">Função</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuário</option>
              <option value="manager">Gerente</option>
            </select>
            <select className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm">
              <option value="">Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
            <select className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm">
              <option value="">Ordenar por</option>
              <option value="name">Nome</option>
              <option value="email">E-mail</option>
              <option value="lastAccess">Último acesso</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Users Grid/List */}
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            view={view}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum usuário encontrado
          </p>
        </div>
      )}
    </div>
  );
}