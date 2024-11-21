import { useState } from 'react';
import { 
  MoreVertical,
  FileText,
  Edit2,
  Ban,
  Eye,
  Receipt,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Contract } from '../../types/contract';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContractCardProps {
  contract: Contract;
  onView: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onGenerateBilling: () => void;
}

export function ContractCard({
  contract,
  onView,
  onEdit,
  onCancel,
  onGenerateBilling
}: ContractCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusIcon = () => {
    switch (contract.status) {
      case 'ATIVO':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELADO':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'SUSPENSO':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'EXPIRADO':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {contract.contract_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contrato #{contract.contract_id}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
              getStatusColor()
            )}>
              {getStatusIcon()}
              {contract.status}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onView();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </button>
                    <button
                      onClick={() => {
                        onEdit();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        onGenerateBilling();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Gerar Faturamento
                    </button>
                    <button
                      onClick={() => {
                        onCancel();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Cancelar Contrato
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Valor
            </p>
            <div className="mt-1 flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
              <p className="text-sm text-gray-900 dark:text-white">
                R$ {contract.contract_value.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Próximo Faturamento
            </p>
            <div className="mt-1 flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              <p className="text-sm text-gray-900 dark:text-white">
                {format(new Date(contract.next_billing_date), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vigência: {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(contract.end_date), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
          <button
            onClick={onView}
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
}