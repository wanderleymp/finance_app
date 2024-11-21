import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  MoreVertical,
  Edit2,
  Eye,
  Loader2
} from 'lucide-react';
import { usePeople } from '../../hooks/usePeople';
import { Person } from '../../types/person';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { PersonDetails } from './PersonDetails';

interface PersonListProps {
  searchTerm: string;
}

export function PersonList({ searchTerm }: PersonListProps) {
  const { people, isLoading } = usePeople();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredPeople = people.filter(person =>
    person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.fantasy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.documents.some(doc => doc.document_value.includes(searchTerm))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Documentos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contatos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Licenças
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPeople.map((person) => (
                <tr key={person.person_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          person.person_type_description === 'Pessoa Física'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
                        )}>
                          {person.person_type_description === 'Pessoa Física' ? (
                            <User className="h-5 w-5" />
                          ) : (
                            <Building2 className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {person.full_name}
                        </div>
                        {person.fantasy_name && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {person.fantasy_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      person.person_type_description === 'Pessoa Física'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    )}>
                      {person.person_type_description}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {person.documents.map((doc) => (
                        <div key={doc.person_document_id} className="flex items-center space-x-1">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{doc.document_type}: {doc.document_value}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {person.contacts.map((contact) => (
                        <div key={contact.contact_id} className="flex items-center space-x-1">
                          {contact.contact_type === 'E-Mail' ? (
                            <Mail className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Phone className="h-4 w-4 text-gray-400" />
                          )}
                          <span>{contact.contact_value}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {person.licenses.map((license) => (
                        <div key={license.license_id} className="flex items-center space-x-1">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            license.status === 'Ativa'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          )}>
                            {license.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPerson(person);
                          setShowDetails(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toast.info('Função em desenvolvimento')}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Person Details Modal */}
      {showDetails && selectedPerson && (
        <PersonDetails
          person={selectedPerson}
          onClose={() => {
            setShowDetails(false);
            setSelectedPerson(null);
          }}
        />
      )}
    </>
  );
}