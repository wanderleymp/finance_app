import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPeople, createPerson, updatePerson, deletePerson } from '../services/peopleService';
import { toast } from 'sonner';
import { Person } from '../types/person';

// Mock data for development
const mockPeople: Person[] = [
  {
    person_id: 1,
    full_name: 'Wanderley Macedo',
    birth_date: null,
    created_at: '2024-03-10T10:00:00',
    fantasy_name: 'Wanderley Macedo Pinheiro Junior',
    social_capital: null,
    person_type_description: 'Pessoa Física',
    contacts: [
      {
        contact_id: 1,
        contact_type: 'E-Mail',
        contact_value: 'wanderley@agilegestao.com',
        contact_name: null
      },
      {
        contact_id: 2,
        contact_type: 'Whatsapp',
        contact_value: '5569999768281',
        contact_name: 'Wanderley'
      }
    ],
    documents: [
      {
        person_document_id: 1,
        document_type: 'CPF',
        document_value: '419.150.032-53'
      }
    ],
    pix_keys: [],
    tax_regimes: [
      {
        tax_regime_id: 1,
        tax_regime_description: 'Simples Nacional',
        start_date: '2024-01-01'
      }
    ],
    licenses: [],
    qsa: [],
    cnae: [
      {
        cnae_id: 1,
        cnae_code: '6202-3/00',
        cnae_description: 'Desenvolvimento de software',
        is_primary: true
      }
    ]
  },
  {
    person_id: 2,
    full_name: 'Agile Gestão Empresarial',
    birth_date: null,
    created_at: '2024-03-09T14:30:00',
    fantasy_name: 'Agile Finance',
    social_capital: 100000,
    person_type_description: 'Pessoa Jurídica',
    contacts: [
      {
        contact_id: 3,
        contact_type: 'E-Mail',
        contact_value: 'contato@agilefinance.com.br',
        contact_name: 'Comercial'
      }
    ],
    documents: [
      {
        person_document_id: 2,
        document_type: 'CNPJ',
        document_value: '12.345.678/0001-90'
      }
    ],
    pix_keys: [],
    tax_regimes: [
      {
        tax_regime_id: 2,
        tax_regime_description: 'Lucro Presumido',
        start_date: '2024-01-01'
      }
    ],
    licenses: [],
    qsa: [],
    cnae: [
      {
        cnae_id: 2,
        cnae_code: '6204-0/00',
        cnae_description: 'Consultoria em tecnologia da informação',
        is_primary: true
      }
    ]
  }
];

export function usePeople() {
  const queryClient = useQueryClient();

  // Use mock data instead of API call
  const { data: people = mockPeople, isLoading, error } = useQuery({
    queryKey: ['people'],
    queryFn: () => Promise.resolve(mockPeople),
    // Disable automatic refetching while using mock data
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const createMutation = useMutation({
    mutationFn: (newPerson: Partial<Person>) => {
      // Simulate API call with mock data
      const person = {
        ...newPerson,
        person_id: Math.max(...mockPeople.map(p => p.person_id)) + 1,
        created_at: new Date().toISOString(),
      } as Person;
      mockPeople.push(person);
      return Promise.resolve(person);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast.success('Pessoa cadastrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cadastrar pessoa');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Person> }) => {
      // Simulate API call with mock data
      const index = mockPeople.findIndex(p => p.person_id === id);
      if (index === -1) throw new Error('Pessoa não encontrada');
      mockPeople[index] = { ...mockPeople[index], ...data };
      return Promise.resolve(mockPeople[index]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast.success('Cadastro atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar cadastro');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      // Simulate API call with mock data
      const index = mockPeople.findIndex(p => p.person_id === id);
      if (index === -1) throw new Error('Pessoa não encontrada');
      mockPeople.splice(index, 1);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast.success('Cadastro excluído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir cadastro');
    },
  });

  return {
    people,
    isLoading,
    error,
    createPerson: createMutation.mutate,
    updatePerson: updateMutation.mutate,
    deletePerson: deleteMutation.mutate,
  };
}