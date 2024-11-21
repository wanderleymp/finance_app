import { useState } from 'react';
import { 
  X,
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  Key,
  Plus,
  CheckCircle,
  XCircle,
  Edit2
} from 'lucide-react';
import { Person } from '../../types/person';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { usePeople } from '../../hooks/usePeople';
import { toast } from 'sonner';
import { formatCPF, formatCNPJ } from '../../utils/formatters';
import { PersonEdit } from './PersonEdit';

interface PersonDetailsProps {
  person: Person;
  onClose: () => void;
}

export function PersonDetails({ person, onClose }: PersonDetailsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'contacts' | 'documents' | 'licenses'>('info');
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              person.person_type_description === 'Pessoa Física'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50'
                : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50'
            )}>
              {person.person_type_description === 'Pessoa Física' ? (
                <User className="h-5 w-5" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {person.full_name}
              </h2>
              {person.fantasy_name && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {person.fantasy_name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEdit(true)}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
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
              onClick={() => setActiveTab('contacts')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'contacts'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Contatos
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'documents'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Documentos
            </button>
            <button
              onClick={() => setActiveTab('licenses')}
              className={cn(
                "pb-2 text-sm font-medium border-b-2",
                activeTab === 'licenses'
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Licenças
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tipo
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {person.person_type_description}
                  </p>
                </div>
                {person.birth_date && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Data de Nascimento
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {format(new Date(person.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Data de Cadastro
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {format(new Date(person.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {person.contacts.map((contact) => (
                  <div key={contact.contact_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {contact.contact_type === 'E-Mail' ? (
                        <Mail className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Phone className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.contact_value}
                        </p>
                        {contact.contact_name && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {contact.contact_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                {person.documents.map((doc) => (
                  <div key={doc.person_document_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.document_type}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {doc.document_type === 'CPF' 
                            ? formatCPF(doc.document_value)
                            : formatCNPJ(doc.document_value)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'licenses' && (
              <div className="space-y-4">
                {person.licenses.map((license) => (
                  <div key={license.license_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {license.license_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Desde {format(new Date(license.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium",
                      license.status === 'Ativa'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                    )}>
                      {license.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <PersonEdit
          person={person}
          onClose={() => {
            setShowEdit(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}