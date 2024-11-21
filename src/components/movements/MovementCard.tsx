import { useState } from 'react';
import { 
  MoreVertical,
  FileText,
  Receipt,
  Send,
  Eye,
  MessageCircle,
  Mail,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Movement } from '../../types/movement';
import { cn } from '../../lib/utils';

interface MovementCardProps {
  movement: Movement;
  onViewDetails: (movement: Movement) => void;
  onGenerateInvoice: (movement: Movement) => void;
  onGenerateBankSlip: (movement: Movement) => void;
  onSendBillingMessage: (movement: Movement, method: 'email' | 'whatsapp') => void;
}

export function MovementCard({
  movement,
  onViewDetails,
  onGenerateInvoice,
  onGenerateBankSlip,
  onSendBillingMessage
}: MovementCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-full",
            movement.type === 'ENTRADA'
              ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
          )}>
            {movement.type === 'ENTRADA' ? (
              <ArrowUpCircle className="h-5 w-5" />
            ) : (
              <ArrowDownCircle className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              #{movement.movement_id}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(movement.date), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onGenerateInvoice(movement);
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Nota Fiscal
                </button>
                <button
                  onClick={() => {
                    onGenerateBankSlip(movement);
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Gerar Boleto
                </button>
                <button
                  onClick={() => {
                    onSendBillingMessage(movement, 'email');
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por E-mail
                </button>
                <button
                  onClick={() => {
                    onSendBillingMessage(movement, 'whatsapp');
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-900 dark:text-white">
          {movement.description || 'Sem descrição'}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            R$ {movement.net_amount.toFixed(2)}
          </p>
          <button
            onClick={() => onViewDetails(movement)}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detalhes
          </button>
        </div>

        {movement.invoice && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FileText className="h-4 w-4 mr-1" />
            NF-e: {movement.invoice.invoice_number}
          </div>
        )}

        {movement.bank_slip && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Receipt className="h-4 w-4 mr-1" />
            Boleto gerado
          </div>
        )}
      </div>
    </div>
  );
}