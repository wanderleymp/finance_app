import { useState } from 'react';
import { 
  X,
  FileText,
  DollarSign,
  Calendar,
  Receipt,
  Mail,
  MessageCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { Movement } from '../../types/movement';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { IS_DEMO } from '../../utils/constants';

interface MovementDetailsProps {
  movement: Movement;
  onClose: () => void;
  onGenerateInvoice: (movement: Movement) => void;
  onGenerateBankSlip: (movement: Movement) => void;
  onSendBillingMessage: (movement: Movement, method: 'email' | 'whatsapp') => void;
}

export function MovementDetails({
  movement,
  onClose,
  onGenerateInvoice,
  onGenerateBankSlip,
  onSendBillingMessage
}: MovementDetailsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'items' | 'payments' | 'installments'>('info');

  const getStatusColor = (status: Movement['status']) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'PROCESSANDO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'CONCLUIDO':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  if (!movement) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          {/* Demo Mode Indicator */}
          {IS_DEMO && (
            <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    Modo demonstração - Os dados exibidos são simulados
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center",
                movement.type === 'ENTRADA'
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              )}>
                {movement.type === 'ENTRADA' ? (
                  <ArrowUpCircle className="h-6 w-6 text-white" />
                ) : (
                  <ArrowDownCircle className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Movimento #{movement.movement_id}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {movement.description || 'Sem descrição'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                getStatusColor(movement.status)
              )}>
                {movement.status}
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
              onClick={() => setActiveTab('items')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'items'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Itens
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'payments'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Pagamentos
            </button>
            <button
              onClick={() => setActiveTab('installments')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'installments'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Parcelas
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'info' && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Detalhes do Movimento
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Valor Total
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        R$ {movement.total_amount?.toFixed(2) || '0.00'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Data do Movimento
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(movement.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pessoa
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Pessoa #{movement.person_id}
                      </dd>
                    </div>
                    {movement.invoice && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Nota Fiscal
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {movement.invoice.invoice_number}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Ações
                  </h3>
                  <div className="space-y-3">
                    {!movement.invoice && (
                      <button
                        onClick={() => onGenerateInvoice(movement)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar Nota Fiscal
                      </button>
                    )}
                    {!movement.bank_slip && (
                      <button
                        onClick={() => onGenerateBankSlip(movement)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Gerar Boleto
                      </button>
                    )}
                    <button
                      onClick={() => onSendBillingMessage(movement, 'email')}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar por E-mail
                    </button>
                    <button
                      onClick={() => onSendBillingMessage(movement, 'whatsapp')}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar por WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Itens do Movimento
                </h3>
                <div className="space-y-4">
                  {movement.items?.map((item) => (
                    <div
                      key={item.item_id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Valor unitário: R$ {item.unit_price?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Total: R$ {item.total_price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!movement.items || movement.items.length === 0) && (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nenhum item encontrado
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Pagamentos
                </h3>
                <div className="space-y-4">
                  {movement.payments?.map((payment) => (
                    <div
                      key={payment.payment_id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.payment_method}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            R$ {payment.amount?.toFixed(2) || '0.00'}
                          </p>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            payment.status === 'PAGO'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                              : payment.status === 'PENDENTE'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          )}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!movement.payments || movement.payments.length === 0) && (
                    <div className="text-center py-8">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nenhum pagamento encontrado
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'installments' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Parcelas
                </h3>
                <div className="space-y-4">
                  {movement.installments?.map((installment) => (
                    <div
                      key={installment.installment_id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Parcela #{installment.installment_id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vencimento: {format(new Date(installment.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            R$ {installment.amount?.toFixed(2) || '0.00'}
                          </p>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            installment.status === 'PAGO'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                              : installment.status === 'PENDENTE'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                              : installment.status === 'VENCIDO'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                          )}>
                            {installment.status}
                          </span>
                        </div>
                      </div>
                      {installment.payment_date && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Pago em: {format(new Date(installment.payment_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  ))}

                  {(!movement.installments || movement.installments.length === 0) && (
                    <div className="text-center py-8">
                      <Clock className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nenhuma parcela encontrada
                      </h3>
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