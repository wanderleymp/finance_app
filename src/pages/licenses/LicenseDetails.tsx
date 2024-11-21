import { X, Key, Users, Calendar, DollarSign, Check } from 'lucide-react';
import { License } from '../../types/license';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LicenseDetailsProps {
  license: License;
  onClose: () => void;
}

export function LicenseDetails({ license, onClose }: LicenseDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Key className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {license.license_name}
                </h2>
                {license.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {license.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Preço
                </p>
                <div className="mt-1 flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    R$ {license.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Duração
                </p>
                <div className="mt-1 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {license.duration_months} meses
                  </p>
                </div>
              </div>

              {license.max_users && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Limite de Usuários
                  </p>
                  <div className="mt-1 flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {license.max_users} usuários
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <span
                  className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    license.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {license.status === 'active' ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data de Criação
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {format(new Date(license.created_at), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Última Atualização
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {format(new Date(license.updated_at), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          </div>

          {license.features && license.features.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recursos Inclusos
              </h3>
              <ul className="space-y-2">
                {license.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}