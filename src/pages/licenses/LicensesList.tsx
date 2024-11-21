import { useState } from 'react';
import { 
  Plus, 
  Search,
  Filter,
  SlidersHorizontal,
  Key,
  Users,
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { License } from '../../types/license';
import { ViewToggle } from '../../components/licenses/ViewToggle';
import { LicenseCard } from '../../components/licenses/LicenseCard';
import { ExportButton } from '../../components/licenses/ExportButton';
import { Pagination } from '../../components/Pagination';
import { useLicenses } from '../../hooks/useLicenses';
import { LicenseDetails } from './LicenseDetails';

const ITEMS_PER_PAGE = 9;

export function LicensesList() {
  const { licenses, isLoading, error, updateLicense, deleteLicense } = useLicenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    priceRange: '',
    orderBy: '',
  });

  const filteredLicenses = licenses.filter(license =>
    license.license_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLicenses.length / ITEMS_PER_PAGE);
  const paginatedLicenses = filteredLicenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const metrics = [
    { 
      name: 'Total de Licenças', 
      value: licenses.length, 
      icon: Key,
      color: 'indigo'
    },
    { 
      name: 'Licenças Ativas', 
      value: licenses.filter(l => l.status === 'active').length,
      icon: Key,
      color: 'green'
    },
    { 
      name: 'Usuários Ativos', 
      value: licenses.reduce((acc, l) => acc + (l.max_users || 0), 0),
      icon: Users,
      color: 'blue'
    },
    { 
      name: 'Receita Mensal', 
      value: `R$ ${licenses
        .filter(l => l.status === 'active')
        .reduce((acc, l) => acc + l.price, 0)
        .toFixed(2)}`,
      icon: DollarSign,
      color: 'purple'
    }
  ];

  const handleEdit = (license: License) => {
    toast.info('Função de edição em desenvolvimento');
  };

  const handleDelete = (license: License) => {
    toast.error(`Confirma exclusão da licença ${license.license_name}?`, {
      action: {
        label: 'Confirmar',
        onClick: () => {
          deleteLicense(license.license_id);
        },
      },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Licenças
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie as licenças do sistema
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButton licenses={licenses} />
          <button
            onClick={() => toast.info('Função em desenvolvimento')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Licença
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
              placeholder="Buscar licenças..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(1);
                }}
                className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">Status</option>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
              </select>
              <select
                value={filters.priceRange}
                onChange={(e) => {
                  setFilters({ ...filters, priceRange: e.target.value });
                  setCurrentPage(1);
                }}
                className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">Faixa de Preço</option>
                <option value="0-100">Até R$ 100</option>
                <option value="100-200">R$ 100 - R$ 200</option>
                <option value="200+">Acima de R$ 200</option>
              </select>
              <select
                value={filters.orderBy}
                onChange={(e) => {
                  setFilters({ ...filters, orderBy: e.target.value });
                  setCurrentPage(1);
                }}
                className="rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">Ordenar por</option>
                <option value="name">Nome</option>
                <option value="price">Preço</option>
                <option value="created_at">Data de Criação</option>
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
          {/* Licenses Grid/List */}
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
            <AnimatePresence>
              {paginatedLicenses.map((license) => (
                <LicenseCard
                  key={license.license_id}
                  license={license}
                  view={view}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={() => setSelectedLicense(license)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredLicenses.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Key className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Nenhuma licença encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? 'Tente usar termos diferentes na busca'
                  : 'Comece cadastrando uma nova licença'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredLicenses.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredLicenses.length}
            />
          )}
        </>
      )}

      {/* License Details Modal */}
      {selectedLicense && (
        <LicenseDetails
          license={selectedLicense}
          onClose={() => setSelectedLicense(null)}
        />
      )}
    </div>
  );
}