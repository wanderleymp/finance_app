import { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  LayoutGrid, 
  List as ListIcon,
  Filter,
  Users,
  Building2,
  Calendar
} from 'lucide-react';
import { Person } from '../../types/person';
import { PersonList } from '../../components/people/PersonList';
import { PersonGrid } from '../../components/people/PersonGrid';
import { PersonDetails } from '../../components/people/PersonDetails';
import { PersonForm } from '../../components/people/PersonForm';
import { usePeople } from '../../hooks/usePeople';
import { motion } from 'framer-motion';

export function PeopleList() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const { people, isLoading } = usePeople();

  // Calculate metrics
  const totalPeople = people.length;
  const physicalPeople = people.filter(p => p.person_type_description === 'Pessoa Física').length;
  const legalPeople = people.filter(p => p.person_type_description === 'Pessoa Jurídica').length;
  const recentPeople = people.filter(p => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(p.created_at) > thirtyDaysAgo;
  }).length;

  const metrics = [
    { name: 'Total de Pessoas', value: totalPeople, icon: Users, color: 'indigo' },
    { name: 'Pessoas Físicas', value: physicalPeople, icon: Users, color: 'blue' },
    { name: 'Pessoas Jurídicas', value: legalPeople, icon: Building2, color: 'purple' },
    { name: 'Cadastros Recentes', value: recentPeople, icon: Calendar, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pessoas
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie pessoas físicas e jurídicas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nova Pessoa
        </button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-${metric.color}-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                    {isLoading ? '-' : metric.value}
                  </p>
                </div>
                <Icon className={`h-8 w-8 text-${metric.color}-500`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10 rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white text-sm transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md transition-colors ${
              view === 'list'
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <ListIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-md transition-colors ${
              view === 'grid'
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <PersonList onSelect={setSelectedPerson} searchTerm={searchTerm} />
      ) : (
        <PersonGrid onSelect={setSelectedPerson} searchTerm={searchTerm} />
      )}

      {/* Modals */}
      {selectedPerson && (
        <PersonDetails
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}

      {showForm && (
        <PersonForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}