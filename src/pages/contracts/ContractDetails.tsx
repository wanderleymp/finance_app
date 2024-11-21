import { useState } from 'react';
import { 
  X,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  Edit2,
  Ban,
  Receipt,
  Plus,
  History,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Contract } from '../../types/contract';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';

interface ContractDetailsProps {
  contract: Contract;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onGenerateBilling: () => void;
}

export function ContractDetails({
  contract,
  onClose,
  onEdit,
  onCancel,
  onGenerateBilling
}: ContractDetailsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'adjustments' | 'services' | 'billing'>('info');

  const getStatusColor = () => {
    switch (contract.status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'SUSPENSO':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'EXPIRADO':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {contract.contract_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contrato #{contract.contract_id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                getStatusColor()
              )}>
                {contract.status}
              </span>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'info'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('adjustments')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'adjustments'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Ajustes
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'services'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Serviços Extras
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'billing'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Faturamento
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'info' && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Detalhes do Contrato
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Valor do Contrato
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        R$ {contract.contract_value.toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Período de Vigência
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(contract.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Próximo Faturamento
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(contract.next_billing_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Ações
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={onEdit}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar Contrato
                    </button>
                    <button
                      onClick={onGenerateBilling}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Gerar Faturamento
                    </button>
                    <button
                      onClick={onCancel}
                      className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Cancelar Contrato
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adjustments' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Histórico de Ajustes
                  </h3>
                  <button
                    onClick={() => {/* TODO: Implement add adjustment */}}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Ajuste
                  </button>
                </div>

                <div className="space-y-4">
                  {contract.adjustments.map((adjustment) => (
                    <div
                      key={adjustment.adjustment_id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {adjustment.adjustment_type}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(adjustment.adjustment_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            De: R$ {adjustment.previous_value.toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Para: R$ {adjustment.new_value.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {adjustment.reason && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {adjustment.reason}
                        </p>
                      )}
                    </div>
                  ))}

                  {contract.adjustments.length === 0 && (
                    <div className="text-center py-8">
                      <History className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nenhum ajuste encontrado
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Comece adicionando um novo ajuste ao contrato
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Serviços Extras
                  </h3>
                  <button
                    onClick={() => {/* TODO: Implement add service */}}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Serviço
                  </button>
                </div>

                <div className="space-y-4">
                  {contract.extra_services.map((service) => (
                    <div
                      key={service.service_id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {service.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(service.service_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            R$ {service.value.toFixed(2)}
                          </p>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            service.status === 'FATURADO'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                              : service.status === 'PENDENTE'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          )}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {contract.extra_services.length === 0 && (
                    <div className="text-center py-8">
                      <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nenhum serviço extra encontrado
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Comece adicionando um novo serviço ao contrato
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Histórico de Faturamento
                  </h3>
                  <button
                    onClick={onGenerateBilling}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Gerar Faturamento
                  </button>
                </div>

                <div className="space-y-4">
                  {contract.billing_logs.map((log) => (
                    <div
                      key={log.log_id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Faturamento #{log.log_id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(log.billing_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            R$ {log.amount.toFixed(2)}
                          </p>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            log.status === 'SUCESSO'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                              : log.status === 'PENDENTE'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          )}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                      {log.error_message && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          Erro: {log.error_message}
                        </p>
                      )}
                    </div>
                  ))}

                  {contract.billing_logs.length === 0 && (
                    <div className="text-center py-8">
                      <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nenhum faturamento encontrado
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Clique em "Gerar Faturamento" para criar um novo faturamento
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}