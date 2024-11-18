import { useState } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Share2,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { User } from '../../types/user';
import { generatePDF } from '../../utils/pdf';
import { cn } from '../../lib/utils';

interface UserCardProps {
  user: User;
  view: 'grid' | 'list';
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onStatusChange: (user: User, status: 'active' | 'inactive') => void;
}

export function UserCard({ user, view, onEdit, onDelete, onStatusChange }: UserCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleShare = (type: 'email' | 'whatsapp' | 'pdf') => {
    const text = `Informações do usuário: ${user.name} (${user.email})`;
    
    if (type === 'email') {
      window.location.href = `mailto:?subject=Informações do Usuário&body=${encodeURIComponent(text)}`;
    } else if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (type === 'pdf') {
      generatePDF(user);
    }
    
    setShowDropdown(false);
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
              <span className="text-white font-medium text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {user.role}
            </span>
            <button
              onClick={() => onStatusChange(user, user.status === 'active' ? 'inactive' : 'active')}
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                user.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              )}
            >
              {user.status === 'active' ? 'Ativo' : 'Inativo'}
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
              <span className="text-white font-medium text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight mt-1">
                {user.email}
              </p>
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
                          onEdit(user);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          onDelete(user);
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

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
              Função
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white leading-tight">
              {user.role}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
              Último Acesso
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white leading-tight">
              {new Date(user.lastAccess).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => onStatusChange(user, user.status === 'active' ? 'inactive' : 'active')}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              user.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
            }`}
          >
            {user.status === 'active' ? (
              <CheckCircle className="w-4 h-4 mr-1" />
            ) : (
              <XCircle className="w-4 h-4 mr-1" />
            )}
            {user.status === 'active' ? 'Ativo' : 'Inativo'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}