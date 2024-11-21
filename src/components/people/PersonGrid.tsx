import { useState } from 'react';
import { 
  User,
  Building2,
  Mail,
  Phone,
  MoreVertical,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { usePeople } from '../../hooks/usePeople';
import { Person } from '../../types/person';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface PersonGridProps {
  onSelect: (person: Person) => void;
  searchTerm: string;
}

export function PersonGrid({ onSelect, searchTerm }: PersonGridProps) {
  const { people, isLoading, deletePerson } = usePeople();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const filteredPeople = people.filter(person =>
    person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.fantasy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.documents.some(doc => doc.document_value.includes(searchTerm))
  );

  const handleDelete = (person: Person) => {
    toast.error(`Confirma exclusão de ${person.full_name}?`, {
      action: {
        label: 'Confirmar',
        onClick: () => deletePerson(person.person_id),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPeople.map((person, index) => (
        <motion.div
          key={person.person_id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  person.person_type_description === 'Pessoa Física'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-200'
                )}>
                  {person.person_type_description === 'Pessoa Física' ? (
                    <User className="h-6 w-6" />
                  ) : (
                    <Building2 className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {person.full_name}
                  </h3>
                  {person.fantasy_name && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {person.fantasy_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === person.person_id ? null : person.person_id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>

                {activeDropdown === person.person_id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onSelect(person);
                          setActiveDropdown(null);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </button>
                      <button
                        onClick={() => {
                          toast.info('Função em desenvolvimento');
                          setActiveDropdown(null);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(person);
                          setActiveDropdown(null);
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

            <div className="mt-4 space-y-3">
              {person.documents.map((doc) => (
                <div key={doc.person_document_id} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{doc.document_type}: {doc.document_value}</span>
                </div>
              ))}

              {person.contacts.map((contact) => (
                <div key={contact.contact_id} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {contact.contact_type === 'E-Mail' ? (
                    <Mail className="h-4 w-4 mr-2" />
                  ) : (
                    <Phone className="h-4 w-4 mr-2" />
                  )}
                  {contact.contact_value}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={() => onSelect(person)}
                className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/70 transition-colors"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}