import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Wallet, 
  Target,
  Settings,
  HelpCircle,
  Key,
  X,
  UserCircle,
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Pessoas', href: '/people', icon: UserCircle },
  { name: 'Movimentos', href: '/movements', icon: ArrowLeftRight },
  { name: 'Finanças', href: '/finances', icon: Wallet },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Licenças', href: '/licenses', icon: Key },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
  { name: 'Ajuda', href: '/help', icon: HelpCircle },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-2 rounded-full">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Agile Finance
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-150 ease-in-out",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-300"
                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    )}
                  />
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  WP
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Wanderley Pinheiro
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrador
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}