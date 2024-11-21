import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Person } from '../../types/person';
import { X, Loader2, Building2, User } from 'lucide-react';
import { usePeople } from '../../hooks/usePeople';
import { searchPersonByCNPJ } from '../../services/personService';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { formatCNPJ, formatCPF, validateCNPJ, validateCPF } from '../../utils/formatters';

interface PersonFormProps {
  onClose: () => void;
}

// Form schemas
const typeSchema = z.object({
  person_type_description: z.enum(['Pessoa Física', 'Pessoa Jurídica'], {
    required_error: 'Selecione o tipo de pessoa'
  })
});

const cnpjSchema = z.object({
  cnpj: z.string()
    .min(14, 'CNPJ inválido')
    .refine(validateCNPJ, 'CNPJ inválido'),
  group_id: z.number({
    required_error: 'Selecione o grupo'
  })
});

const physicalSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string()
    .min(11, 'CPF inválido')
    .refine(validateCPF, 'CPF inválido'),
  birth_date: z.string().optional(),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  group_id: z.number({
    required_error: 'Selecione o grupo'
  })
});

type TypeForm = z.infer<typeof typeSchema>;
type CNPJForm = z.infer<typeof cnpjSchema>;
type PhysicalForm = z.infer<typeof physicalSchema>;

export function PersonForm({ onClose }: PersonFormProps) {
  const [step, setStep] = useState<'type' | 'cnpj' | 'physical'>('type');
  const [isLoading, setIsLoading] = useState(false);
  const { createPerson } = usePeople();
  const [selectedType, setSelectedType] = useState<'Pessoa Física' | 'Pessoa Jurídica' | null>(null);

  // Form hooks
  const typeForm = useForm<TypeForm>({
    resolver: zodResolver(typeSchema)
  });

  const cnpjForm = useForm<CNPJForm>({
    resolver: zodResolver(cnpjSchema)
  });

  const physicalForm = useForm<PhysicalForm>({
    resolver: zodResolver(physicalSchema)
  });

  // Form handlers
  const handleTypeSubmit = async (data: TypeForm) => {
    setSelectedType(data.person_type_description);
    setStep(data.person_type_description === 'Pessoa Jurídica' ? 'cnpj' : 'physical');
  };

  const handleCNPJSubmit = async (data: CNPJForm) => {
    try {
      setIsLoading(true);
      const personData = await searchPersonByCNPJ(data.cnpj);
      await createPerson({
        ...personData,
        group_id: data.group_id
      });
      toast.success('Pessoa jurídica cadastrada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao cadastrar pessoa jurídica');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhysicalSubmit = async (data: PhysicalForm) => {
    try {
      setIsLoading(true);
      await createPerson({
        full_name: data.full_name,
        person_type_description: 'Pessoa Física',
        documents: [{
          document_type: 'CPF',
          document_value: data.cpf
        }],
        contacts: [
          {
            contact_type: 'E-Mail',
            contact_value: data.email
          },
          {
            contact_type: 'Telefone',
            contact_value: data.phone
          }
        ],
        birth_date: data.birth_date,
        group_id: data.group_id
      });
      toast.success('Pessoa física cadastrada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao cadastrar pessoa física');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              selectedType === 'Pessoa Física'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50'
                : selectedType === 'Pessoa Jurídica'
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-900/50'
            )}>
              {selectedType === 'Pessoa Física' ? (
                <User className="h-5 w-5" />
              ) : selectedType === 'Pessoa Jurídica' ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Nova Pessoa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {step === 'type' && (
            <form onSubmit={typeForm.handleSubmit(handleTypeSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Pessoa
                </label>
                <select
                  {...typeForm.register('person_type_description')}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                >
                  <option value="">Selecione o tipo...</option>
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                </select>
                {typeForm.formState.errors.person_type_description && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {typeForm.formState.errors.person_type_description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </form>
          )}

          {step === 'cnpj' && (
            <form onSubmit={cnpjForm.handleSubmit(handleCNPJSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CNPJ
                </label>
                <input
                  type="text"
                  {...cnpjForm.register('cnpj')}
                  onChange={(e) => {
                    const formatted = formatCNPJ(e.target.value);
                    e.target.value = formatted;
                    cnpjForm.setValue('cnpj', formatted);
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  placeholder="00.000.000/0000-00"
                />
                {cnpjForm.formState.errors.cnpj && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {cnpjForm.formState.errors.cnpj.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grupo
                </label>
                <select
                  {...cnpjForm.register('group_id', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                >
                  <option value="">Selecione o grupo...</option>
                  <option value="1">Cliente</option>
                  <option value="2">Fornecedor</option>
                  <option value="3">Parceiro</option>
                </select>
                {cnpjForm.formState.errors.group_id && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {cnpjForm.formState.errors.group_id.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('type')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Buscar CNPJ'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'physical' && (
            <form onSubmit={physicalForm.handleSubmit(handlePhysicalSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome Completo
                </label>
                <input
                  type="text"
                  {...physicalForm.register('full_name')}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  placeholder="Digite o nome completo"
                />
                {physicalForm.formState.errors.full_name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {physicalForm.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CPF
                </label>
                <input
                  type="text"
                  {...physicalForm.register('cpf')}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    e.target.value = formatted;
                    physicalForm.setValue('cpf', formatted);
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  placeholder="000.000.000-00"
                />
                {physicalForm.formState.errors.cpf && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {physicalForm.formState.errors.cpf.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  {...physicalForm.register('birth_date')}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail
                </label>
                <input
                  type="email"
                  {...physicalForm.register('email')}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  placeholder="exemplo@email.com"
                />
                {physicalForm.formState.errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {physicalForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefone
                </label>
                <input
                  type="tel"
                  {...physicalForm.register('phone')}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  placeholder="(00) 00000-0000"
                />
                {physicalForm.formState.errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {physicalForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grupo
                </label>
                <select
                  {...physicalForm.register('group_id', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                >
                  <option value="">Selecione o grupo...</option>
                  <option value="1">Cliente</option>
                  <option value="2">Fornecedor</option>
                  <option value="3">Parceiro</option>
                </select>
                {physicalForm.formState.errors.group_id && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {physicalForm.formState.errors.group_id.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('type')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Cadastrar'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}