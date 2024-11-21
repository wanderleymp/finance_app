import { useState } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2,
  Mail,
  Phone,
  MessageCircle,
  Key,
  Calendar,
  User as UserIcon,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { User } from '../../services/userService';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface UserCardProps {
  user: User;
  view: 'grid' | 'list';
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewDetails: (user: User) => void;
  onStatusChange: (user: User) => void;
}

export function UserCard({ 
  user, 
  view, 
  onEdit, 
  onDelete,
  onViewDetails,
  onStatusChange 
}: UserCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const mainEmail = user.person.contacts.find(c => c.contact_type === 'E-Mail')?.contact_value;
  const mainWhatsApp = user.person.contacts.find(c => c.contact_type === 'Whatsapp')?.contact_value;
  const mainDocument = user.person.documents[0]?.document_value;
  const activeLicense = user.person.licenses.find(l => l.status === 'Ativa');

  const handleWhatsAppClick = () => {
    if (mainWhatsApp) {
      window.open(`https://wa.me/${mainWhatsApp.replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleEmailClick = () => {
    if (mainEmail) {
      window.location.href = `mailto:${mainEmail}`;
    }
  };

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
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.person.full_name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {mainDocument && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {mainDocument}
                  </span>
                )}
                {mainEmail && (
                  <button
                    onClick={handleEmailClick}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                )}
                {mainWhatsApp && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-green-600 hover:text-green-700 dark:text-green-400"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onStatusChange(user)}
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                activeLicense
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              )}
            >
              {activeLicense ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Ativo
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Inativo
                </>
              )}
            </button>
            <button
              onClick={() => onViewDetails(user)}
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
                        onEdit(user);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        onDelete(user);
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
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {user.person.full_name}
              </h3>
              {user.username && (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight mt-1">
                  {user.username}
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
                      onEdit(user);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete(user);
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

        <div className="mt-4 space-y-3">
          {mainDocument && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <UserIcon className="h-4 w-4 mr-2" />
              {mainDocument}
            </div>
          )}
          
          {mainEmail && (
            <button
              onClick={handleEmailClick}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <Mail className="h-4 w-4 mr-2" />
              {mainEmail}
            </button>
          )}
          
          {mainWhatsApp && (
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {mainWhatsApp}
            </button>
          )}
        </div>

        {activeLicense && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Key className="h-4 w-4 text-indigo-500 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {activeLicense.license_name}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Desde {format(new Date(activeLicense.start_date), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => onStatusChange(user)}
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              activeLicense
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            )}
          >
            {activeLicense ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Ativo
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Inativo
              </>
            )}
          </button>
          
          <button
            onClick={() => onViewDetails(user)}
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