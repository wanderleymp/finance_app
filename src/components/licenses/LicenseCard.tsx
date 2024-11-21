import { useState } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2,
  Key,
  Users,
  Calendar,
  DollarSign,
  Share2,
  Eye
} from 'lucide-react';
import { License } from '../../types/license';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LicenseCardProps {
  license: License;
  view: 'grid' | 'list';
  onEdit: (license: License) => void;
  onDelete: (license: License) => void;
  onViewDetails: (license: License) => void;
}

export function LicenseCard({ 
  license, 
  view, 
  onEdit, 
  onDelete,
  onViewDetails 
}: LicenseCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Key className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {license.license_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {license.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              R$ {license.price.toFixed(2)}
            </span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                license.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              )}
            >
              {license.status === 'active' ? 'Ativa' : 'Inativa'}
            </span>
            <button
              onClick={() => onViewDetails(license)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 text-gray-500" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onEdit(license);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        onDelete(license);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {license.license_name}
              </h3>
              {license.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight mt-1">
                  {license.description}
                </p>
              )}
            </div>
          </div>
          
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
                      onEdit(license);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete(license);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Preço
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              R$ {license.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Duração
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {license.duration_months} meses
            </p>
          </div>
          {license.max_users && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Usuários
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                Até {license.max_users} usuários
              </p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Criada em
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {format(new Date(license.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              license.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            )}
          >
            {license.status === 'active' ? 'Ativa' : 'Inativa'}
          </span>
          
          <button
            onClick={() => onViewDetails(license)}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver detalhes
          </button>
        </div>
      </div>
    </motion.div>
  );
}