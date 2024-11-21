import { useState } from 'react';
import { 
  Plus, 
  Search,
  Filter,
  SlidersHorizontal,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Contract, ContractStatus } from '../../types/contract';
import { ContractCard } from '../../components/contracts/ContractCard';
import { ContractForm } from '../../components/contracts/ContractForm';
import { ContractDetails } from './ContractDetails';
import { useContracts } from '../../hooks/useContracts';
import { Pagination } from '../../components/Pagination';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ITEMS_PER_PAGE = 10;

export function ContractsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '' as ContractStatus | '',
    startDate: '',
    endDate: '',
    groupId: '',
  });

  const { 
    contracts, 
    isLoading, 
    error,
    createContract,
    updateContract,
    cancelContract,
    generateBilling
  } = useContracts(filters);

  const activeContracts = contracts.filter(c => c.status === 'ATIVO');
  const totalValue = activeContracts.reduce((acc, c) => acc + c.contract_value, 0);
  const problemContracts = contracts.filter(c => 
    c.status === 'CANCELADO' || 
    c.status === 'SUSPENSO' || 
    new Date(c.end_date) <= new Date()
  );

  const metrics = [
    { 
      name: 'Contratos Ativos', 
      value: activeContracts.length,
      icon: FileText,
      color: 'indigo'
    },
    { 
      name: 'Valor Total', 
      value: `R$ ${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'green'
    },
    { 
      name: 'Próximos Vencimentos', 
      value: contracts.filter(c => {
        const nextBilling = new Date(c.next_billing_date);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return nextBilling <= thirtyDaysFromNow;
      }).length,
      icon: Calendar,
      color: 'blue'
    },
    { 
      name: 'Contratos com Problemas', 
      value: problemContracts.length,
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (data: any) => {
    if (selectedContract) {
      updateContract({ id: selectedContract.contract_id, data });
    } else {
      createContract(data);
    }
    setShowForm(false);
    setSelectedContract(null);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500 dark:text-red-400 text-center mb-4">
          Erro ao carregar contratos
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
            Contratos
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie seus contratos e faturamentos
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedContract(null);
            setShowForm(true);
          }}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Contrato
        </button>
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full h-10 rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm transition-colors"
            />
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus <boltAction type="file" filePath="src/pages/contracts/ContractsList.tsx">:ring-indigo-500 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
        </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as ContractStatus })}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="">Todos</option>
                  <option value="ATIVO">Ativo</option>
                  <option value="SUSPENSO">Suspenso</option>
                  <option value="CANCELADO">Cancelado</option>
                  <option value="EXPIRADO">Expirado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Final
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grupo
                </label>
                <select
                  value={filters.groupId}
                  onChange={(e) => setFilters({ ...filters, groupId: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="">Todos</option>
                  <option value="1">Manutenção</option>
                  <option value="2">Consultoria</option>
                  <option value="3">Desenvolvimento</option>
                </select>
              </div>
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
          {/* Contracts List */}
          <div className="space-y-4">
            {contracts.map((contract) => (
              <ContractCard
                key={contract.contract_id}
                contract={contract}
                onView={() => setSelectedContract(contract)}
                onEdit={() => {
                  setSelectedContract(contract);
                  setShowForm(true);
                }}
                onCancel={() => {
                  toast.error(`Confirma cancelamento do contrato ${contract.contract_name}?`, {
                    action: {
                      label: 'Confirmar',
                      onClick: () => cancelContract(contract.contract_id),
                    },
                  });
                }}
                onGenerateBilling={() => generateBilling(contract.contract_id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {contracts.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Nenhum contrato encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? 'Tente usar termos diferentes na busca'
                  : 'Comece criando um novo contrato'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {contracts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(contracts.length / ITEMS_PER_PAGE)}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={contracts.length}
            />
          )}
        </>
      )}

      {/* Contract Form Modal */}
      {showForm && (
        <ContractForm
          contract={selectedContract}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedContract(null);
          }}
        />
      )}

      {/* Contract Details Modal */}
      {selectedContract && !showForm && (
        <ContractDetails
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
          onEdit={() => {
            setShowForm(true);
          }}
          onCancel={() => {
            cancelContract(selectedContract.contract_id);
            setSelectedContract(null);
          }}
          onGenerateBilling={() => {
            generateBilling(selectedContract.contract_id);
          }}
        />
      )}
    </div>
  );
}