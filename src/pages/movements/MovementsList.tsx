import { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign,
  LayoutGrid,
  List as ListIcon,
  FileText,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Movement, MovementStatus, MovementType } from '../../types/movement';
import { ViewToggle } from '../../components/movements/ViewToggle';
import { MovementCard } from '../../components/movements/MovementCard';
import { MovementTable } from '../../components/movements/MovementTable';
import { MovementKanban } from '../../components/movements/MovementKanban';
import { ExportButton } from '../../components/movements/ExportButton';
import { Pagination } from '../../components/Pagination';
import { useMovements } from '../../hooks/useMovements';
import { MovementDetails } from './MovementDetails';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const ITEMS_PER_PAGE = 10;

type ViewMode = 'table' | 'kanban';
type DateFilter = 'today' | 'week' | 'month' | 'custom';

export function MovementsList() {
  // States for filters and view mode
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [typeFilter, setTypeFilter] = useState<MovementType | ''>('');
  const [statusFilter, setStatusFilter] = useState<MovementStatus | ''>('');

  // Calculate date ranges based on filter
  const getDateRange = () => {
    const today = new Date();
    switch (dateFilter) {
      case 'today':
        return {
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd')
        };
      case 'week':
        return {
          startDate: format(startOfWeek(today), 'yyyy-MM-dd'),
          endDate: format(endOfWeek(today), 'yyyy-MM-dd')
        };
      case 'month':
        return {
          startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(today), 'yyyy-MM-dd')
        };
      case 'custom':
        return customDateRange;
      default:
        return { startDate: '', endDate: '' };
    }
  };

  const { 
    movements,
    total,
    totalPages,
    isLoading,
    error,
    generateInvoice,
    generateBankSlip,
    sendBillingMessage
  } = useMovements({
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    ...getDateRange(),
    search: searchTerm,
    page: currentPage,
    limit: ITEMS_PER_PAGE
  });

  const totalEntradas = movements
    .filter(m => m.type === 'ENTRADA')
    .reduce((acc, m) => acc + m.net_amount, 0);

  const totalSaidas = movements
    .filter(m => m.type === 'SAIDA')
    .reduce((acc, m) => acc + m.net_amount, 0);

  const metrics = [
    { 
      name: 'Total de Movimentos', 
      value: total,
      icon: Calendar,
      color: 'indigo'
    },
    { 
      name: 'Entradas', 
      value: movements.filter(m => m.type === 'ENTRADA').length,
      total: totalEntradas,
      icon: ArrowUpCircle,
      color: 'green'
    },
    { 
      name: 'Saídas', 
      value: movements.filter(m => m.type === 'SAIDA').length,
      total: totalSaidas,
      icon: ArrowDownCircle,
      color: 'red'
    },
    { 
      name: 'Saldo', 
      value: totalEntradas - totalSaidas,
      icon: DollarSign,
      color: 'blue'
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500 dark:text-red-400 text-center mb-4">
          Erro ao carregar movimentos
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
            Movimentos
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestão de Movimentos Financeiros
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButton movements={movements} />
          <button
            onClick={() => setSelectedMovement({} as Movement)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Movimento
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-${metric.color}-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                    {isLoading ? '-' : typeof metric.value === 'number' && metric.name === 'Saldo'
                      ? `R$ ${metric.value.toFixed(2)}`
                      : metric.value}
                  </p>
                  {metric.total !== undefined && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      R$ {metric.total.toFixed(2)}
                    </p>
                  )}
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
              placeholder="Buscar movimentos..."
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
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <ListIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as MovementType | '')}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="">Todos</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as MovementStatus | '')}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="">Todos</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="PROCESSANDO">Processando</option>
                  <option value="CONCLUIDO">Concluído</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Período
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="today">Hoje</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {dateFilter === 'custom' && (
                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data Inicial
                    </label>
                    <input
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => setCustomDateRange(prev => ({
                        ...prev,
                        startDate: e.target.value
                      }))}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data Final
                    </label>
                    <input
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => setCustomDateRange(prev => ({
                        ...prev,
                        endDate: e.target.value
                      }))}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                    />
                  </div>
                </div>
              )}
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
          {/* Movements List/Kanban */}
          {viewMode === 'table' ? (
            <MovementTable
              movements={movements}
              onViewDetails={setSelectedMovement}
              onGenerateInvoice={generateInvoice}
              onGenerateBankSlip={generateBankSlip}
              onSendBillingMessage={sendBillingMessage}
            />
          ) : (
            <MovementKanban
              movements={movements}
              onViewDetails={setSelectedMovement}
              onGenerateInvoice={generateInvoice}
              onGenerateBankSlip={generateBankSlip}
              onSendBillingMessage={sendBillingMessage}
            />
          )}

          {/* Empty State */}
          {movements.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Nenhum movimento encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? 'Tente usar termos diferentes na busca'
                  : 'Comece criando um novo movimento'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {movements.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={total}
            />
          )}
        </>
      )}

      {/* Movement Details Modal */}
      {selectedMovement && (
        <MovementDetails
          movement={selectedMovement}
          onClose={() => setSelectedMovement(null)}
          onGenerateInvoice={generateInvoice}
          onGenerateBankSlip={generateBankSlip}
          onSendBillingMessage={sendBillingMessage}
        />
      )}
    </div>
  );
}