import { useState } from 'react';
import { Person } from '../../types/person';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Calendar,
  DollarSign,
  Share2,
  MessageCircle,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface PersonDetailsProps {
  person: Person;
  onClose: () => void;
}

export function PersonDetails({ person, onClose }: PersonDetailsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'contacts' | 'documents' | 'address'>('info');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleShare = (type: 'email' | 'whatsapp') => {
    const formatAddress = () => {
      if (!person.street) return '';
      return `\nEndereço: ${person.street}, ${person.number}${person.complement ? ` - ${person.complement}` : ''}\n${person.neighborhood}, ${person.city} - ${person.state}\nCEP: ${person.postal_code}`;
    };

    const formatContacts = () => {
      return person.contacts
        .map(c => `${c.contact_type}: ${c.contact_value}`)
        .join('\n');
    };

    const text = `
${person.full_name}${person.fantasy_name ? `\nNome Fantasia: ${person.fantasy_name}` : ''}
Tipo: ${person.person_type_description}
${person.documents.map(d => `${d.document_type}: ${d.document_value}`).join('\n')}
${formatContacts()}${formatAddress()}
    `.trim();

    if (type === 'email') {
      window.location.href = `mailto:?subject=Informações de ${person.full_name}&body=${encodeURIComponent(text)}`;
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    setShowShareOptions(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                {person.person_type_description === 'Pessoa Física' ? (
                  <User className="h-6 w-6 text-white" />
                ) : (
                  <Building2 className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                
                {showShareOptions && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleShare('email')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Compartilhar por E-mail
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Compartilhar por WhatsApp
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
            {[
              { id: 'info', label: 'Informações', icon: FileText },
              { id: 'contacts', label: 'Contatos', icon: Phone },
              { id: 'documents', label: 'Documentos', icon: FileText },
              { id: 'address', label: 'Endereço', icon: MapPin },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'info' && (
              <div className="space-y-4">
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
                      Data de Cadastro
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {format(new Date(person.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>

                {person.tax_regimes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Regime Tributário
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {person.tax_regimes[0].tax_regime_description}
                    </p>
                  </div>
                )}

                {person.cnae.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      CNAE Principal
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {person.cnae.find(c => c.is_primary)?.cnae_description || person.cnae[0].cnae_description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {person.contacts.map((contact) => (
                  <div key={contact.contact_id} className="flex items-center space-x-3">
                    {contact.contact_type === 'E-Mail' ? (
                      <Mail className="h-5 w-5 text-gray-400" />
                    ) : contact.contact_type === 'Whatsapp' ? (
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Phone className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {contact.contact_value}
                      </p>
                      {contact.contact_name && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.contact_name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                {person.documents.map((doc) => (
                  <div key={doc.person_document_id} className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.document_type}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.document_value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {person.street}, {person.number}
                      {person.complement && ` - ${person.complement}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {person.neighborhood}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {person.city} - {person.state}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      CEP: {person.postal_code}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}