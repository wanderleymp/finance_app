import { useState } from 'react';
import { 
  UserPlus, 
  Search,
  Filter,
  SlidersHorizontal,
  Users as UsersIcon,
  Building,
  Calendar,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Person } from '../../types/person';
import { ViewToggle } from '../../components/people/ViewToggle';
import { PersonCard } from '../../components/people/PersonCard';
import { ExportButton } from '../../components/people/ExportButton';
import { usePeople } from '../../hooks/usePeople';

export function PeopleList() {
  const { people, isLoading, error, updatePerson, deletePerson } = usePeople();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    taxRegime: '',
    orderBy: '',
  });

  const filteredPeople = people.filter(person =>
    person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.fantasy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.documents.some(doc => doc.document_value.includes(searchTerm))
  );

  const metrics = [
    { 
      name: 'Total de Pessoas', 
      value: people.length, 
      icon: UsersIcon, 
      color: 'indigo' 
    },
    { 
      name: 'Pessoas Físicas', 
      value: people.filter(p => p.person_type_description === 'Pessoa Física').length, 
      icon: UsersIcon,
      color: 'blue'
    },
    { 
      name: 'Pessoas Jurídicas', 
      value: people.filter(p => p.person_type_description === 'Pessoa Jurídica').length, 
      icon: Building,
      color: 'green'
    },
    { 
      name: 'Cadastros Recentes', 
      value: people.filter(p => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(p.created_at) > thirtyDaysAgo;
      }).length,
      icon: Calendar,
      color: 'purple'
    }
  ];

  const handleEdit = (person: Person) => {
    toast.info('Função de edição em desenvolvimento');
  };

  const handleDelete = (person: Person) => {
    toast.error(`Confirma exclusão de ${person.full_name}?`, {
      action: {
        label: 'Confirmar',
        onClick: () => {
          deletePerson(person.person_id);
        },
      },
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500 dark:text-red-400 text-center mb-4">
          Erro ao carregar os dados
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            Pessoas
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-tight">
            Gerencie pessoas físicas e jurídicas
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButton people={people} />
          <button
            onClick={() => toast.info('Função em desenvolvimento')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nova Pessoa
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
                    {isLoading ? '-' : metric.value}
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
              placeholder="Buscar por nome, documento..."
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
      <AnimatePresence>
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
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">Tipo de Pessoa</option>
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
              <select
                value={filters.taxRegime}
                onChange={(e) => setFilters({ ...filters, taxRegime: e.target.value })}
                className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">Regime Tributário</option>
                <option value="simples">Simples Nacional</option>
                <option value="lucro_presumido">Lucro Presumido</option>
                <option value="lucro_real">Lucro Real</option>
              </select>
              <select
                value={filters.orderBy}
                onChange={(e) => setFilters({ ...filters, orderBy: e.target.value })}
                className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">Ordenar por</option>
                <option value="name">Nome</option>
                <option value="created_at">Data de Cadastro</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          {/* People Grid/List */}
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
            <AnimatePresence>
              {filteredPeople.map((person) => (
                <PersonCard
                  key={person.person_id}
                  person={person}
                  view={view}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredPeople.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Nenhuma pessoa encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? 'Tente usar termos diferentes na busca'
                  : 'Comece cadastrando uma nova pessoa'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}