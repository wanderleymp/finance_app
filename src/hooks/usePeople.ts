import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Person } from '../types/person';
import { toast } from 'sonner';
import {
  listPersons,
  createPerson,
  updatePerson,
  deletePerson,
  addContact,
  updateContact,
  deleteContact,
  addAddress,
  updateAddress,
  deleteAddress,
  addDocument,
  updateDocument,
  deleteDocument
} from '../services/personService';

export function usePeople() {
  const queryClient = useQueryClient();

  const { data: people = [], isLoading, error } = useQuery({
    queryKey: ['people'],
    queryFn: listPersons,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Person>) => createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Pessoa cadastrada com sucesso!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Person> }) => 
      updatePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Pessoa atualizada com sucesso!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Pessoa excluída com sucesso!');
    },
  });

  // Contact mutations
  const addContactMutation = useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: any }) =>
      addContact(personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Contato adicionado com sucesso!');
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ personId, contactId, data }: { personId: number; contactId: number; data: any }) =>
      updateContact(personId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Contato atualizado com sucesso!');
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: ({ personId, contactId }: { personId: number; contactId: number }) =>
      deleteContact(personId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Contato excluído com sucesso!');
    },
  });

  // Address mutations
  const addAddressMutation = useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: any }) =>
      addAddress(personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Endereço adicionado com sucesso!');
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ personId, addressId, data }: { personId: number; addressId: number; data: any }) =>
      updateAddress(personId, addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Endereço atualizado com sucesso!');
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: ({ personId, addressId }: { personId: number; addressId: number }) =>
      deleteAddress(personId, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Endereço excluído com sucesso!');
    },
  });

  // Document mutations
  const addDocumentMutation = useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: any }) =>
      addDocument(personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Documento adicionado com sucesso!');
    },
  });

  const updateDocumentMutation = useMutation({
    mutationFn: ({ personId, documentId, data }: { personId: number; documentId: number; data: any }) =>
      updateDocument(personId, documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Documento atualizado com sucesso!');
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: ({ personId, documentId }: { personId: number; documentId: number }) =>
      deleteDocument(personId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
      toast.success('Documento excluído com sucesso!');
    },
  });

  return {
    people,
    isLoading,
    error,
    createPerson: createMutation.mutate,
    updatePerson: updateMutation.mutate,
    deletePerson: deleteMutation.mutate,
    addContact: addContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    addAddress: addAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    addDocument: addDocumentMutation.mutate,
    updateDocument: updateDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
  };
}