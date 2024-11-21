import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Person } from '../../types/person';
import { X, Loader2, Building2, User, Plus, Trash2 } from 'lucide-react';
import { usePeople } from '../../hooks/usePeople';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { formatCNPJ, formatCPF, validateCNPJ, validateCPF } from '../../utils/formatters';

interface PersonEditProps {
  person: Person;
  onClose: () => void;
}

const editSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  fantasy_name: z.string().optional(),
  birth_date: z.string().optional(),
  contacts: z.array(z.object({
    contact_type: z.enum(['E-Mail', 'Telefone', 'Whatsapp']),
    contact_value: z.string().min(1, 'Valor do contato é obrigatório'),
    contact_name: z.string().optional(),
  })),
  documents: z.array(z.object({
    document_type: z.string(),
    document_value: z.string().refine(
      (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length === 11 ? validateCPF(cleaned) : validateCNPJ(cleaned);
      },
      'Documento inválido'
    ),
  })),
});

type EditForm = z.infer<typeof editSchema>;

export function PersonEdit({ person, onClose }: PersonEditProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updatePerson } = usePeople();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      full_name: person.full_name,
      fantasy_name: person.fantasy_name || '',
      birth_date: person.birth_date || '',
      contacts: person.contacts,
      documents: person.documents,
    },
  });

  const handleSave = async (data: EditForm) => {
    try {
      setIsLoading(true);
      await updatePerson(person.person_id, data);
      toast.success('Pessoa atualizada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar pessoa');
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = () => {
    const contacts = watch('contacts') || [];
    setValue('contacts', [
      ...contacts,
      { contact_type: 'E-Mail', contact_value: '', contact_name: '' }
    ]);
  };

  const removeContact = (index: number) => {
    const contacts = watch('contacts') || [];
    setValue('contacts', contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              person.person_type_description === 'Pessoa Física'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50'
                : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50'
            )}>
              {person.person_type_description === 'Pessoa Física' ? (
                <User className="h-5 w-5" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Editar Pessoa
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {person.person_type_description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome {person.person_type_description === 'Pessoa Física' ? 'Completo' : 'Razão Social'}
              </label>
              <input
                type="text"
                {...register('full_name')}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {person.person_type_description === 'Pessoa Jurídica' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  {...register('fantasy_name')}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                />
              </div>
            )}

            {person.person_type_description === 'Pessoa Física' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  {...register('birth_date')}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                />
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Documentos
              </h3>
            </div>

            {watch('documents')?.map((doc, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    {...register(`documents.${index}.document_value`)}
                    onChange={(e) => {
                      const formatted = doc.document_type.toLowerCase().includes('cpf')
                        ? formatCPF(e.target.value)
                        : formatCNPJ(e.target.value);
                      e.target.value = formatted;
                      setValue(`documents.${index}.document_value`, formatted);
                    }}
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  />
                </div>
                {errors.documents?.[index]?.document_value && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.documents[index].document_value?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Contatos
              </h3>
              <button
                type="button"
                onClick={addContact}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/70"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Contato
              </button>
            </div>

            {watch('contacts')?.map((contact, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <select
                    {...register(`contacts.${index}.contact_type`)}
                    className="mt-1 block w-40 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  >
                    <option value="E-Mail">E-mail</option>
                    <option value="Telefone">Telefone</option>
                    <option value="Whatsapp">WhatsApp</option>
                  </select>
                  <input
                    type="text"
                    {...register(`contacts.${index}.contact_value`)}
                    placeholder="Valor do contato"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  />
                  <input
                    type="text"
                    {...register(`contacts.${index}.contact_name`)}
                    placeholder="Identificação (opcional)"
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                {errors.contacts?.[index]?.contact_value && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.contacts[index].contact_value?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}