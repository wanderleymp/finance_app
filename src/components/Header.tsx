import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow">
      <div className="flex flex-1 justify-between px-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-1">
          <div className="flex w-full md:ml-0">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              {/* Search implementation will go here */}
            </div>
          </div>
        </div>

        <div className="ml-4 flex items-center md:ml-6 gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <Bell size={20} />
          </button>

          <div className="relative ml-3">
            <button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <User size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}