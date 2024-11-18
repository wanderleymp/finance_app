import { useState } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Share2,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Person } from '../../types/person';
import { generatePDF } from '../../utils/pdf';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PersonCardProps {
  person: Person;
  view: 'grid' | 'list';
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}

export function PersonCard({ person, view, onEdit, onDelete }: PersonCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleShare = (type: 'email' | 'whatsapp' | 'pdf') => {
    const text = `Informações de ${person.full_name}`;
    
    if (type === 'email') {
      window.location.href = `mailto:?subject=Informações do Cadastro&body=${encodeURIComponent(text)}`;
    } else if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (type === 'pdf') {
      generatePDF(person);
    }
    
    setShowDropdown(false);
  };

  const mainDocument = person.documents[0]?.document_value || 'N/A';
  const mainEmail = person.contacts.find(c => c.contact_type === 'E-Mail')?.contact_value || 'N/A';
  const mainPhone = person.contacts.find(c => c.contact_type === 'Telefone' || c.contact_type === 'Celular')?.contact_value || 'N/A';

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
              {person.person_type_description === 'Pessoa Física' ? (
                <User className="h-5 w-5 text-white" />
              ) : (
                <Building2 className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {person.full_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {mainDocument}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {person.person_type_description}
            </span>
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
                        onEdit(person);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        onDelete(person);
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
              {person.person_type_description === 'Pessoa Física' ? (
                <User className="h-6 w-6 text-white" />
              ) : (
                <Building2 className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {person.full_name}
              </h3>
              {person.fantasy_name && (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight mt-1">
                  {person.fantasy_name}
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
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1 divide-y divide-gray-100 dark:divide-gray-600">
                  <div className="px-3 py-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Ações
                    </span>
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => {
                          onEdit(person);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          onDelete(person);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </button>
                    </div>
                  </div>
                  
                  <div className="px-3 py-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Compartilhar
                    </span>
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => handleShare('email')}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Via E-mail
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Via WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare('pdf')}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tipo
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {person.person_type_description}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Cadastro
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {format(new Date(person.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{mainDocument}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{mainEmail}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{mainPhone}</span>
            </div>
          </div>

          {person.tax_regimes.length > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Regime Tributário
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {person.tax_regimes[0].tax_regime_description}
              </p>
            </div>
          )}

          {person.cnae.length > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                CNAE Principal
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {person.cnae.find(c => c.is_primary)?.cnae_description || person.cnae[0].cnae_description}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}