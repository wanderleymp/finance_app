import { useState } from 'react';
import { 
  UserPlus, 
  Search,
  Filter,
  SlidersHorizontal,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Clock,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ViewToggle } from '../../components/users/ViewToggle';
import { UserCard } from '../../components/users/UserCard';
import { ExportButton } from '../../components/users/ExportButton';
import { useUsers } from '../../hooks/useUsers';
import { Pagination } from '../../components/Pagination';
import { UserDetails } from '../../components/users/UserDetails';
import { User } from '../../services/userService';
import { IS_DEMO } from '../../utils/constants';

const ITEMS_PER_PAGE = 9;

export function UsersList() {
  const { users, isLoading, error, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    profile: '',
    status: '',
    orderBy: '',
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.person.contacts.some(c => 
      c.contact_value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const metrics = [
    { 
      name: 'Total de Usuários', 
      value: users.length, 
      icon: UsersIcon, 
      color: 'indigo' 
    },
    { 
      name: 'Usuários Ativos', 
      value: users.filter(u => u.person.licenses.some(l => l.status === 'Ativa')).length,
      icon: UserCheck,
      color: 'green'
    },
    { 
      name: 'Usuários Inativos', 
      value: users.filter(u => !u.person.licenses.some(l => l.status === 'Ativa')).length,
      icon: UserX,
      color: 'red'
    },
    { 
      name: 'Último Cadastro', 
      value: users.length > 0 
        ? new Date(Math.max(...users.map(u => new Date(u.person.created_at).getTime())))
            .toLocaleDateString('pt-BR')
        : '-',
      icon: Clock,
      color: 'blue'
    },
  ];

  const handleEdit = (user: User) => {
    toast.info('Função de edição em desenvolvimento');
  };

  const handleDelete = (user: User) => {
    toast.error(`Confirma exclusão de ${user.person.full_name}?`, {
      action: {
        label: 'Confirmar',
        onClick: () => {
          deleteUser(user.id);
          setSelectedUser(null);
        },
      },
    });
  };

  const handleStatusChange = (user: User) => {
    const hasActiveLicense = user.person.licenses.some(l => l.status === 'Ativa');
    const newStatus = hasActiveLicense ? 'Inativa' : 'Ativa';
    
    // In a real application, you would update the license status through an API
    const updatedUser = {
      ...user,
      person: {
        ...user.person,
        licenses: user.person.licenses.map(l => ({
          ...l,
          status: newStatus
        }))
      }
    };

    updateUser({ id: user.id, data: updatedUser });
    toast.success(`Usuário ${newStatus.toLowerCase()} com sucesso!`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500 dark:text-red-400 text-center mb-4">
          {IS_DEMO 
            ? 'Erro ao carregar dados simulados'
            : 'Erro ao conectar com o servidor'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Usuários
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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

      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
}